import { Handle, Position, type NodeProps } from '@xyflow/react';

export function DecisionNode({ data }: NodeProps) {
    return (
        <div className="w-20 h-20 relative flex items-center justify-center">
            {/* Rotated Diamond Shape */}
            <div className="w-14 h-14 bg-card border-2 border-primary transform rotate-45 shadow-sm absolute z-0" />

            {/* Label (Not rotated, on top) */}
            <div className="relative z-10 text-xs text-center p-1 font-semibold max-w-[80px] break-words pointer-events-none">
                {data.label as string}
            </div>

            {/* Handles - Omni-directional (Both Source and Target at each position) */}

            {/* Top */}
            <Handle type="target" position={Position.Top} id="top-target" className="w-3 h-3 bg-secondary-foreground border-2 border-background" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }} />
            <Handle type="source" position={Position.Top} id="top-source" className="w-3 h-3 bg-secondary-foreground border-2 border-background opacity-0" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }} />

            {/* Right */}
            <Handle type="source" position={Position.Right} id="right-source" className="w-3 h-3 bg-secondary-foreground border-2 border-background" style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }} />
            <Handle type="target" position={Position.Right} id="right-target" className="w-3 h-3 bg-secondary-foreground border-2 border-background opacity-0" style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }} />

            {/* Bottom */}
            <Handle type="source" position={Position.Bottom} id="bottom-source" className="w-3 h-3 bg-secondary-foreground border-2 border-background" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }} />
            <Handle type="target" position={Position.Bottom} id="bottom-target" className="w-3 h-3 bg-secondary-foreground border-2 border-background opacity-0" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }} />

            {/* Left */}
            <Handle type="target" position={Position.Left} id="left-target" className="w-3 h-3 bg-secondary-foreground border-2 border-background" style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }} />
            <Handle type="source" position={Position.Left} id="left-source" className="w-3 h-3 bg-secondary-foreground border-2 border-background opacity-0" style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }} />
        </div>
    );
}
