import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useLanguageStore } from '../../store/useLanguageStore';

export function StartEndNode({ data, selected }: NodeProps) {
    const { t } = useLanguageStore();
    return (
        <div className={'relative flex min-h-11 w-[158px] items-center justify-center rounded-full border border-primary/70 bg-teal-50 px-4 py-2 text-center text-sm font-medium text-primary shadow-sm '
            + (selected ? 'ring-2 ring-primary ring-offset-2' : '')}>
            <span className="min-w-0 break-words">{String(data.label) || t.editor.startEnd}</span>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
}
