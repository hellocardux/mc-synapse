import type { Edge, Node } from '@xyflow/react';

export const nodeTypes = ['task', 'decision', 'start-end'] as const;
export type ProcessNodeType = typeof nodeTypes[number];
export const raciKeys = ['R', 'A', 'C', 'I'] as const;
export type RACIRole = typeof raciKeys[number];
export type Assignments = Record<RACIRole, string[]>;
export type RACIMatrix = Record<string, Assignments>;

export interface ProjectMeta {
    projectName: string;
    roles: string[];
    owner?: string;
    purpose?: string;
    triggers?: string;
    outputs?: string;
    kpis?: string;
    risks?: string;
    legacyKpisAndRisks?: string;
}

export interface SipocData {
    suppliers: string;
    inputs: string;
    process: string;
    outputs: string;
    customers: string;
}

export interface ProjectData {
    meta: ProjectMeta;
    nodes: Node[];
    edges: Edge[];
    raci: RACIMatrix;
    sipoc: SipocData[];
}

export const sipocKeys = ['suppliers', 'inputs', 'process', 'outputs', 'customers'] as const;
export const emptySipocRow: SipocData = { suppliers: '', inputs: '', process: '', outputs: '', customers: '' };
export const emptyAssignments: Assignments = { R: [], A: [], C: [], I: [] };
export const emptyProject: ProjectData = {
    meta: { projectName: '', roles: [] },
    nodes: [],
    edges: [],
    raci: {},
    sipoc: [emptySipocRow],
};

const version = 1;
const metaFields = ['owner', 'purpose', 'triggers', 'outputs', 'kpis', 'risks', 'legacyKpisAndRisks'] as const;

export const isProcessNodeType = (value: unknown): value is ProcessNodeType =>
    nodeTypes.some((type) => type === value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringList = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'string');

export function projectData({ meta, nodes, edges, raci, sipoc }: ProjectData): ProjectData {
    return { meta, nodes, edges, raci, sipoc };
}

export function hasProjectContent({ meta, nodes, sipoc }: ProjectData): boolean {
    return nodes.length > 0 || meta.roles.length > 0 || Boolean(meta.projectName.trim()) ||
        metaFields.some((key) => Boolean(meta[key]?.trim())) ||
        sipoc.some((row) => sipocKeys.some((key) => Boolean(row[key].trim())));
}

export function encodeProject(data: ProjectData, indent?: number): string {
    const { meta, nodes, edges, raci, sipoc } = projectData(data);
    return JSON.stringify({
        version,
        meta,
        nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
        edges: edges.map(({ id, source, target, sourceHandle, targetHandle, label }) =>
            ({ id, source, target, sourceHandle, targetHandle, label })),
        raci,
        sipoc,
    }, null, indent);
}

function readNode(value: unknown): Node {
    if (!isRecord(value) || typeof value.id !== 'string' || !value.id || !isProcessNodeType(value.type) ||
        !isRecord(value.position) || typeof value.position.x !== 'number' || typeof value.position.y !== 'number' ||
        !Number.isFinite(value.position.x) || !Number.isFinite(value.position.y) ||
        !isRecord(value.data) || typeof value.data.label !== 'string' ||
        (value.data.tags !== undefined && !isStringList(value.data.tags))) {
        throw new Error('Invalid node');
    }

    return {
        id: value.id,
        type: value.type,
        position: { x: value.position.x, y: value.position.y },
        data: { label: value.data.label, tags: value.data.tags },
    };
}

function readEdge(value: unknown): Edge {
    if (!isRecord(value) || typeof value.id !== 'string' || !value.id ||
        typeof value.source !== 'string' || typeof value.target !== 'string' ||
        (value.label != null && typeof value.label !== 'string') ||
        (value.sourceHandle != null && typeof value.sourceHandle !== 'string') ||
        (value.targetHandle != null && typeof value.targetHandle !== 'string')) {
        throw new Error('Invalid edge');
    }
    return {
        id: value.id,
        source: value.source,
        target: value.target,
        label: value.label ?? undefined,
        sourceHandle: value.sourceHandle ?? null,
        targetHandle: value.targetHandle ?? null,
    };
}

function readAssignments(value: unknown): Assignments {
    if (!isRecord(value) || !isStringList(value.R) || !isStringList(value.A) ||
        !isStringList(value.C) || !isStringList(value.I)) {
        throw new Error('Invalid RACI assignments');
    }
    return {
        R: [...new Set(value.R)],
        A: [...new Set(value.A)],
        C: [...new Set(value.C)],
        I: [...new Set(value.I)],
    };
}

function readSipoc(value: unknown): SipocData[] {
    if (value === undefined) return [emptySipocRow];
    if (!Array.isArray(value)) throw new Error('Invalid SIPOC');
    return value.map((row: unknown) => {
        if (!isRecord(row) || !sipocKeys.every((key) => typeof row[key] === 'string')) {
            throw new Error('Invalid SIPOC entry');
        }
        return row as unknown as SipocData;
    });
}

export function parseProject(value: unknown): ProjectData {
    if (!isRecord(value) || (value.version !== undefined && value.version !== version) ||
        !isRecord(value.meta) || typeof value.meta.projectName !== 'string' || !isStringList(value.meta.roles) ||
        !Array.isArray(value.nodes) || !Array.isArray(value.edges) || !isRecord(value.raci)) {
        throw new Error('Invalid project');
    }

    const nodes = value.nodes.map(readNode);
    const edges = value.edges.map(readEdge);
    const nodeIds = new Set(nodes.map((node) => node.id));
    if (nodeIds.size !== nodes.length || new Set(edges.map((edge) => edge.id)).size !== edges.length ||
        edges.some((edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target))) {
        throw new Error('Invalid diagram connections');
    }

    const meta: ProjectMeta = { projectName: value.meta.projectName, roles: [] };
    for (const key of metaFields) {
        const field = value.meta[key];
        if (field === undefined) continue;
        if (typeof field !== 'string') throw new Error('Invalid process information');
        meta[key] = field;
    }
    if (value.version === undefined && meta.kpis) {
        meta.legacyKpisAndRisks = meta.kpis;
        delete meta.kpis;
    }

    const roles = new Set(value.meta.roles);
    const savedRaci = value.raci;
    const raci = Object.fromEntries(nodes.filter((node) => node.type === 'task').map((node) => {
        const saved = Object.hasOwn(savedRaci, node.id) ? savedRaci[node.id] : undefined;
        const assignments = saved === undefined ? emptyAssignments : readAssignments(saved);
        // Older projects can contain assignments for roles removed from the catalogue.
        for (const key of raciKeys) assignments[key].forEach((role) => roles.add(role));
        return [node.id, assignments];
    }));
    meta.roles = [...roles];

    return { meta, nodes, edges, raci, sipoc: readSipoc(value.sipoc) };
}

export function getRaciRows(project: ProjectData) {
    return project.nodes.filter((node) => node.type === 'task').map((node) => ({
        id: node.id,
        label: String(node.data.label),
        assignments: project.raci[node.id] ?? emptyAssignments,
    }));
}
