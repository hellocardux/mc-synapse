import { Handle, Position, type NodeProps } from '@xyflow/react';

export function StartEndNode({ data }: NodeProps) {
    return (
        <div className="px-4 py-2 bg-white border-2 border-stone-400 rounded-full shadow-sm text-sm font-medium">
            {data.label as string}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
            <Handle type="target" position={Position.Top} className="w-2 h-2" />
        </div>
    );
}
