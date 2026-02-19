import { useRef, useCallback, type DragEvent } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useProjectStore } from './store/useProjectStore';
import { TaskNode } from './components/nodes/TaskNode';
import { DecisionNode } from './components/nodes/DecisionNode';
import { StartEndNode } from './components/nodes/StartEndNode';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Header } from './components/Header';
import { SipocTable } from './components/SipocTable';
import { Documentation } from './components/Documentation';

const nodeTypes: NodeTypes = {
  task: TaskNode,
  decision: DecisionNode,
  'start-end': StartEndNode,
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useProjectStore((state) => state.nodes);
  const edges = useProjectStore((state) => state.edges);
  const onNodesChange = useProjectStore((state) => state.onNodesChange);
  const onEdgesChange = useProjectStore((state) => state.onEdgesChange);
  const onConnect = useProjectStore((state) => state.onConnect);
  const addNode = useProjectStore((state) => state.addNode);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: '' },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  const currentView = useProjectStore((state) => state.currentView);

  return (
    <div className="flex h-screen w-screen bg-background text-foreground flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        {currentView === 'diagram' ? (
          <>
            <Sidebar />
            <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            <PropertiesPanel />
          </>
        ) : currentView === 'sipoc' ? (
          <div className="flex-1 h-full w-full overflow-hidden">
            <SipocTable />
          </div>
        ) : (
          <div className="flex-1 h-full w-full overflow-hidden">
            <Documentation />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
