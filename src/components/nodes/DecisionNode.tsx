import { Handle, Position, useStore, type NodeProps } from '@xyflow/react';
import { useLanguageStore } from '../../store/useLanguageStore';

const handles = [
    { side: Position.Top, visible: 'target' },
    { side: Position.Right, visible: 'source' },
    { side: Position.Bottom, visible: 'source' },
    { side: Position.Left, visible: 'source' },
] as const;

export function DecisionNode({ data, selected }: NodeProps) {
    const { t } = useLanguageStore();
    const fromType = useStore((state) => state.connectionClickStartHandle?.type ?? state.connection.fromHandle?.type);
    const requestedType = fromType === 'source' ? 'target' : fromType === 'target' ? 'source' : undefined;
    return (
        <div className="relative grid min-h-[104px] w-[104px] place-items-center py-8">
            <div className={'absolute inset-0 decision-border ' + (selected ? 'bg-primary' : 'bg-slate-500')} />
            <div className="decision-border absolute inset-[2px] bg-teal-50" />
            <div className="pointer-events-none relative max-w-[72px] break-words text-center text-xs font-semibold">
                {String(data.label) || t.editor.decision}
            </div>
            {handles.flatMap(({ side, visible }) => (['target', 'source'] as const).map((type) => (
                <Handle key={side + type} type={type} position={side} id={side + '-' + type}
                    className={type === (requestedType ?? visible) ? '' : 'decision-handle-inactive opacity-0'} />
            )))}
        </div>
    );
}
