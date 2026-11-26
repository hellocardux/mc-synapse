import { useRef, useState, type DragEvent } from 'react';
import { Background, Controls, MarkerType, ReactFlow, ReactFlowProvider, useReactFlow, type Edge, type NodeTypes, type XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Workflow } from 'lucide-react';
import { useProjectStore } from './store/useProjectStore';
import { useLanguageStore } from './store/useLanguageStore';
import { hasProjectContent, isProcessNodeType, type ProcessNodeType, type ProjectData } from './lib/project';
import { exampleProject } from './lib/exampleProject';
import { TaskNode } from './components/nodes/TaskNode';
import { DecisionNode } from './components/nodes/DecisionNode';
import { StartEndNode } from './components/nodes/StartEndNode';
import { MapToolbar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Header } from './components/Header';
import { SipocTable } from './components/SipocTable';
import { Documentation } from './components/Documentation';
import { MobileWarning } from './components/MobileWarning';
import { ProcessPassport } from './components/ProcessPassport';
import { RaciTable } from './components/RaciTable';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './components/ui/dialog';
import { exportJson } from './lib/projectExports';

const nodeTypes: NodeTypes = { task: TaskNode, decision: DecisionNode, 'start-end': StartEndNode };
const defaultEdgeOptions: Partial<Edge> = {
    markerEnd: { type: MarkerType.ArrowClosed, color: '#53677b', width: 16, height: 16 },
    labelBgPadding: [5, 3],
    labelBgBorderRadius: 4,
};

function Diagram({ openProject }: { openProject: (project: ProjectData) => void }) {
    const state = useProjectStore();
    const { t, language } = useLanguageStore();
    const reactFlow = useReactFlow();
    const canvas = useRef<HTMLDivElement>(null);
    const [showProperties, setShowProperties] = useState(true);
    const [pendingDelete, setPendingDelete] = useState<{ nodes: { id: string }[]; edges: { id: string }[] }>();
    const selectedNodes = state.nodes.filter((node) => node.selected);
    const selectedEdges = state.edges.filter((edge) => edge.selected);
    const selectedCount = selectedNodes.length + selectedEdges.length;
    const hasMap = state.nodes.length > 0 || state.edges.length > 0;

    function requestDelete() {
        const selection = { nodes: selectedNodes, edges: selectedEdges };
        if (selectedNodes.length || selectedCount > 1) {
            setPendingDelete(selection);
        } else if (selectedEdges.length) {
            void reactFlow.deleteElements(selection).then(() => canvas.current?.focus());
        }
    }

    function addNode(type: ProcessNodeType, position?: XYPosition) {
        const names = { task: t.editor.activity, decision: t.editor.decision, 'start-end': t.editor.startEnd };
        if (!position && canvas.current) {
            const rect = canvas.current.getBoundingClientRect();
            const base = reactFlow.screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            let candidate = { x: base.x - 80, y: base.y - 24 };
            for (const node of state.nodes) {
                if (Math.abs(node.position.x - candidate.x) < 50 && Math.abs(node.position.y - candidate.y) < 54) {
                    candidate = { x: candidate.x + 28, y: candidate.y + 64 };
                }
            }
            position = candidate;
        }
        state.addNode({
            id: crypto.randomUUID(),
            type,
            position: position ?? { x: 0, y: 0 },
            data: { label: names[type] },
        });
        setShowProperties(true);
    }

    function drop(event: DragEvent) {
        const type = event.dataTransfer.getData('application/reactflow');
        if (!isProcessNodeType(type)) return;
        event.preventDefault();
        addNode(type, reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    }

    return (
        <section className="flex h-full min-h-0 flex-col" aria-label={t.header.map}>
            <MapToolbar
                add={addNode}
                showProperties={showProperties && hasMap}
                toggleProperties={() => setShowProperties(!showProperties)}
                hasMap={hasMap}
                hasSelection={selectedCount > 0}
                deleteSelection={requestDelete}
            />
            <div className="flex min-h-0 flex-1">
                <div className="relative min-w-0 flex-1 bg-slate-50 outline-none" ref={canvas} tabIndex={-1}>
                    <ReactFlow
                        nodes={state.nodes}
                        edges={state.edges}
                        onNodesChange={state.onNodesChange}
                        onEdgesChange={state.onEdgesChange}
                        onConnect={state.onConnect}
                        deleteKeyCode={pendingDelete ? null : ['Backspace', 'Delete']}
                        onBeforeDelete={async ({ nodes, edges }) => {
                            // Keep the diagram and the project draft consistent in a single update.
                            state.deleteMapElements(nodes.map(({ id }) => id), edges.map(({ id }) => id));
                            return false;
                        }}
                        nodeTypes={nodeTypes}
                        defaultEdgeOptions={defaultEdgeOptions}
                        onDragOver={(event) => {
                            if (!event.dataTransfer.types.includes('application/reactflow')) return;
                            event.preventDefault();
                            event.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={drop}
                        fitView
                        fitViewOptions={{ padding: 0.2, maxZoom: 1.25 }}
                        minZoom={0.12}
                        connectOnClick
                    >
                        <Background color="#cbd5e1" gap={20} size={1.1} />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                    {!state.nodes.length && (
                        <div className="pointer-events-none absolute inset-0 grid place-items-center px-5">
                            <div className="pointer-events-auto w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-sm">
                                <div className="mx-auto mb-3 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary"><Workflow size={22} /></div>
                                <h1 className="text-xl font-semibold tracking-tight">{t.editor.mapEmpty}</h1>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.editor.mapEmptyHelp}</p>
                                <div className="mt-5 flex flex-wrap justify-center gap-2">
                                    <Button onClick={() => addNode('task')}>{t.editor.addFirst}</Button>
                                    <Button variant="outline" onClick={() => openProject(exampleProject(language, t.editor.exampleName))}>{t.editor.openExample}</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {showProperties && hasMap && (
                    <PropertiesPanel
                        selectedNodes={selectedNodes}
                        selectedEdges={selectedEdges}
                        close={() => setShowProperties(false)}
                        deleteSelection={requestDelete}
                    />
                )}
            </div>
            <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(undefined); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {pendingDelete?.nodes.length === 1 && !pendingDelete.edges.length
                                ? t.editor.deleteNodeTitle : t.editor.deleteTitle}
                        </DialogTitle>
                        <DialogDescription>
                            {pendingDelete?.nodes.length ? t.editor.deleteWithNodes : t.editor.deleteOnlyEdges}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPendingDelete(undefined)}>{t.editor.cancel}</Button>
                        <Button variant="destructive" onClick={() => {
                            if (pendingDelete) void reactFlow.deleteElements(pendingDelete).then(() => canvas.current?.focus());
                            setPendingDelete(undefined);
                        }}>{t.editor.deleteConfirm}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}

function Editor() {
    const currentView = useProjectStore((state) => state.currentView);
    const [importKey, setImportKey] = useState(0);
    const [pendingProject, setPendingProject] = useState<ProjectData>();
    const { t } = useLanguageStore();

    function switchProject(project: ProjectData) {
        useProjectStore.getState().loadProject(project);
        setImportKey((value) => value + 1);
        setPendingProject(undefined);
    }

    function openProject(project: ProjectData) {
        if (hasProjectContent(useProjectStore.getState())) setPendingProject(project);
        else switchProject(project);
    }

    return (
        <div className="flex h-dvh min-w-0 flex-col overflow-hidden bg-slate-50 text-foreground">
            <Header openProject={openProject} />
            <main className={currentView === 'diagram' ? 'min-h-0 flex-1' : 'min-h-0 flex-1 overflow-y-auto'}>
                {currentView === 'diagram' && <ReactFlowProvider key={importKey}><Diagram openProject={openProject} /></ReactFlowProvider>}
                {currentView === 'overview' && <ProcessPassport />}
                {currentView === 'sipoc' && <SipocTable />}
                {currentView === 'raci' && <RaciTable />}
                {currentView === 'docs' && <Documentation />}
            </main>
            <Dialog open={Boolean(pendingProject)} onOpenChange={(open) => { if (!open) setPendingProject(undefined); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.editor.replaceTitle}</DialogTitle>
                        <DialogDescription>{t.editor.replaceDescription}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPendingProject(undefined)}>{t.editor.cancel}</Button>
                        <Button variant="outline" onClick={() => exportJson(useProjectStore.getState(), t.editor.untitled)}>{t.editor.saveCopy}</Button>
                        <Button onClick={() => { if (pendingProject) switchProject(pendingProject); }}>{t.editor.replace}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function App() {
    return <><MobileWarning /><Editor /></>;
}
