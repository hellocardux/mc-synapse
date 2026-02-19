import { create } from 'zustand';
import { type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

export type RACIRole = 'R' | 'A' | 'C' | 'I';

export interface RACIMatrix {
    [nodeId: string]: {
        R: string[];
        A: string[];
        C: string[];
        I: string[];
    };
}

export interface ProjectMeta {
    projectName: string;
    roles: string[];
    // Governance Fields (ISO/Academy)
    owner?: string;
    purpose?: string;
    triggers?: string;
    outputs?: string;
    kpis?: string;
}

export interface SipocData {
    suppliers: string;
    inputs: string;
    process: string;
    outputs: string;
    customers: string;
}

export type AppView = 'diagram' | 'sipoc' | 'docs';

export interface ProjectState {
    meta: ProjectMeta;
    nodes: Node[];
    edges: Edge[];
    raci: RACIMatrix;
    sipoc: SipocData[]; // Array of rows
    currentView: AppView;

    // Actions
    setProjectName: (name: string) => void;
    setProjectMeta: (meta: Partial<ProjectMeta>) => void;
    addRole: (role: string) => void;
    removeRole: (role: string) => void;
    updateRole: (oldRole: string, newRole: string) => void;

    setSipoc: (data: SipocData[]) => void;
    setView: (view: AppView) => void;

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNode: (node: Node) => void;
    updateNodeData: (id: string, data: any) => void;

    updateRaci: (nodeId: string, roleType: RACIRole, roles: string[]) => void;
    updateEdgeLabel: (edgeId: string, label: string) => void;

    loadProject: (data: ProjectState) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    meta: {
        projectName: 'New Process',
        roles: ['Training Manager', 'HR Specialist', 'IT Support', 'Quality Head']
    },
    nodes: [],
    edges: [],
    raci: {},
    sipoc: [
        { suppliers: '', inputs: '', process: 'Start', outputs: '', customers: '' }
    ],
    currentView: 'diagram',

    setProjectName: (name) => set((state) => ({ meta: { ...state.meta, projectName: name } })),

    setProjectMeta: (updates) => set((state) => ({
        meta: { ...state.meta, ...updates }
    })),

    setSipoc: (data) => set({ sipoc: data }),
    setView: (view) => set({ currentView: view }),

    addRole: (role) => set((state) => ({
        meta: { ...state.meta, roles: [...state.meta.roles, role] }
    })),

    removeRole: (role) => set((state) => ({
        meta: { ...state.meta, roles: state.meta.roles.filter((r) => r !== role) }
    })),

    updateRole: (oldRole, newRole) => set((state) => {
        // TODO: Update RACI references if role name changes
        const newRoles = state.meta.roles.map(r => r === oldRole ? newRole : r);
        return { meta: { ...state.meta, roles: newRoles } };
    }),

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },

    addNode: (node) =>
        set((state) => ({
            nodes: state.nodes.map(n => ({ ...n, selected: false })).concat({ ...node, selected: true }),
            // Initialize empty RACI for new task nodes if needed
            raci: node.type === 'task' ? { ...state.raci, [node.id]: { R: [], A: [], C: [], I: [] } } : state.raci
        })),

    updateNodeData: (id, data) => set((state) => ({
        nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        ),
    })),

    updateRaci: (nodeId, roleType, roles) => set((state) => ({
        raci: {
            ...state.raci,
            [nodeId]: {
                ...(state.raci[nodeId] || { R: [], A: [], C: [], I: [] }),
                [roleType]: roles
            }
        }
    })),

    updateEdgeLabel: (edgeId, label) => set((state) => ({
        edges: state.edges.map((edge) =>
            edge.id === edgeId ? { ...edge, label: label } : edge
        ),
    })),

    loadProject: (project) => set({
        meta: project.meta,
        nodes: project.nodes || [],
        edges: project.edges || [],
        raci: project.raci || {},
        sipoc: project.sipoc || [{ suppliers: '', inputs: '', process: 'Start', outputs: '', customers: '' }]
    })
}));
