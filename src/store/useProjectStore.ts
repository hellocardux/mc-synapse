import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, type OnNodesChange, type OnEdgesChange, type OnConnect, type Node } from '@xyflow/react';
import { emptyAssignments, emptyProject, encodeProject, parseProject, raciKeys, type Assignments, type ProjectData, type ProjectMeta, type RACIRole, type SipocData } from '../lib/project';

export type AppView = 'overview' | 'diagram' | 'sipoc' | 'raci' | 'docs';
type DraftStatus = 'ready' | 'saved' | 'unavailable' | 'invalid' | 'conflict';

interface ProjectState extends ProjectData {
    currentView: AppView;
    draftStatus: DraftStatus;
    setProjectMeta: (meta: Partial<ProjectMeta>) => void;
    addRole: (role: string) => void;
    replaceRole: (role: string, replacement: string, rename?: boolean) => void;
    setSipoc: (data: SipocData[]) => void;
    setView: (view: AppView) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNode: (node: Node) => void;
    deleteMapElements: (nodeIds: string[], edgeIds: string[]) => void;
    updateNodeData: (id: string, data: Node['data']) => void;
    updateRaci: (nodeId: string, roleType: RACIRole, roles: string[]) => void;
    updateEdgeLabel: (edgeId: string, label: string) => void;
    loadProject: (data: ProjectData) => void;
}

const draftKey = 'mc-synapse:draft';
let storedDraft: string | null = null;
let initialData = emptyProject;
let initialStatus: DraftStatus = 'ready';

if (typeof window !== 'undefined') {
    try {
        storedDraft = window.localStorage.getItem(draftKey);
        if (storedDraft !== null) {
            initialStatus = 'invalid';
            initialData = parseProject(JSON.parse(storedDraft));
            initialStatus = 'saved';
        }
    } catch {
        if (storedDraft === null) initialStatus = 'unavailable';
    }
}

export const useProjectStore = create<ProjectState>((set) => ({
    ...initialData,
    currentView: 'diagram',
    draftStatus: initialStatus,
    setProjectMeta: (updates) => set((state) => ({ meta: { ...state.meta, ...updates } })),
    setSipoc: (sipoc) => set({ sipoc }),
    setView: (currentView) => set({ currentView }),

    addRole: (value) => set((state) => {
        const role = value.trim();
        if (!role || state.meta.roles.includes(role)) return state;
        return { meta: { ...state.meta, roles: [...state.meta.roles, role] } };
    }),

    replaceRole: (role, value, rename = false) => set((state) => {
        const replacement = value.trim();
        const currentRoles = state.meta.roles;
        if (!currentRoles.includes(role) || role === replacement) return state;
        if (rename ? !replacement || currentRoles.includes(replacement) : replacement && !currentRoles.includes(replacement)) {
            return state;
        }
        const roles = rename
            ? currentRoles.map((item) => item === role ? replacement : item)
            : currentRoles.filter((item) => item !== role);
        const raci = Object.fromEntries(Object.entries(state.raci).map(([nodeId, assignments]) => {
            const updated: Assignments = { ...assignments };
            for (const key of raciKeys) {
                updated[key] = [...new Set(assignments[key].flatMap((item) => item === role
                    ? replacement ? [replacement] : []
                    : [item]))];
            }
            return [nodeId, updated];
        }));
        return { meta: { ...state.meta, roles }, raci };
    }),

    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

    deleteMapElements: (nodeIds, edgeIds) => set((state) => {
        if (!nodeIds.length && !edgeIds.length) return state;
        const removedNodes = new Set(nodeIds);
        const removedEdges = new Set(edgeIds);
        return {
            nodes: state.nodes.filter((node) => !removedNodes.has(node.id)),
            edges: state.edges.filter((edge) => !removedEdges.has(edge.id) &&
                !removedNodes.has(edge.source) && !removedNodes.has(edge.target)),
            raci: Object.fromEntries(Object.entries(state.raci).filter(([id]) => !removedNodes.has(id))),
        };
    }),

    onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
    onConnect: (connection) => set((state) => ({ edges: addEdge(connection, state.edges) })),

    addNode: (node) => set((state) => ({
        nodes: [...state.nodes.map((item) => ({ ...item, selected: false })), { ...node, selected: true }],
        edges: state.edges.map((edge) => edge.selected ? { ...edge, selected: false } : edge),
        raci: node.type === 'task' ? { ...state.raci, [node.id]: emptyAssignments } : state.raci,
    })),

    updateNodeData: (id, data) => set((state) => ({
        nodes: state.nodes.map((node) => node.id === id ? { ...node, data: { ...node.data, ...data } } : node),
    })),

    updateRaci: (nodeId, roleType, roles) => set((state) => {
        if (!state.nodes.some((node) => node.id === nodeId && node.type === 'task')) return state;
        const validRoles = [...new Set(roles.filter((role) => state.meta.roles.includes(role)))];
        if (roleType === 'A' && validRoles.length > 1) return state;
        return {
            raci: {
                ...state.raci,
                [nodeId]: { ...(state.raci[nodeId] ?? emptyAssignments), [roleType]: validRoles },
            },
        };
    }),

    updateEdgeLabel: (id, label) => set((state) => ({
        edges: state.edges.map((edge) => edge.id === id ? { ...edge, label } : edge),
    })),

    loadProject: (project) => set({ ...project, currentView: 'diagram' }),
}));

if (typeof window !== 'undefined') {
    let lastSnapshot = encodeProject(initialData);

    useProjectStore.subscribe((state, previous) => {
        if (state.draftStatus === 'conflict' || (state.meta === previous.meta && state.nodes === previous.nodes &&
            state.edges === previous.edges && state.raci === previous.raci && state.sipoc === previous.sipoc)) return;

        const snapshot = encodeProject(state);
        if (snapshot === lastSnapshot) return;

        try {
            if (window.localStorage.getItem(draftKey) !== storedDraft) {
                useProjectStore.setState({ draftStatus: 'conflict' });
                return;
            }
            window.localStorage.setItem(draftKey, snapshot);
            storedDraft = snapshot;
            lastSnapshot = snapshot;
            if (state.draftStatus !== 'saved') useProjectStore.setState({ draftStatus: 'saved' });
        } catch {
            if (state.draftStatus !== 'unavailable') useProjectStore.setState({ draftStatus: 'unavailable' });
        }
    });

    window.addEventListener('storage', (event) => {
        if ((event.key === draftKey || event.key === null) && event.newValue !== storedDraft) {
            useProjectStore.setState({ draftStatus: 'conflict' });
        }
    });
}
