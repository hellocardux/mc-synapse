import { Handle, Position, type NodeProps } from '@xyflow/react';
import { AlertCircle, BarChart3, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useLanguageStore } from '../../store/useLanguageStore';

const indicators = [
    { tag: 'risk', icon: TriangleAlert, style: 'bg-amber-100 text-amber-800' },
    { tag: 'control', icon: ShieldCheck, style: 'bg-sky-100 text-sky-800' },
    { tag: 'kpi', icon: BarChart3, style: 'bg-emerald-100 text-emerald-800' },
] as const;

export function TaskNode({ id, data, selected }: NodeProps) {
    const accountable = useProjectStore((state) => state.raci[id]?.A.length ?? 0);
    const { t } = useLanguageStore();
    const tags = (data.tags as string[] | undefined) ?? [];
    const warning = accountable === 0 ? t.editor.accountability.missing : t.editor.accountability.multiple;

    return (
        <div className={'relative flex min-h-[52px] w-44 items-center justify-center rounded-lg border bg-card px-3 py-2 text-center text-sm font-medium shadow-sm '
            + (accountable === 1 ? 'border-slate-400' : 'border-destructive/70') + (selected ? ' ring-2 ring-primary ring-offset-2' : '')}>
            <div className="absolute -top-3 left-2 flex gap-1">
                {indicators.filter(({ tag }) => tags.includes(tag)).map(({ tag, icon: Icon, style }) => (
                    <span key={tag} role="img" title={t.tooltips[tag]} aria-label={t.tooltips[tag]} className={'rounded-md p-0.5 ring-1 ring-white ' + style}>
                        <Icon size={14} />
                    </span>
                ))}
            </div>
            <span className="min-w-0 break-words">{String(data.label) || t.editor.noLabel}</span>
            {accountable !== 1 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-card text-destructive" role="img" title={warning} aria-label={warning}>
                    <AlertCircle size={17} />
                </span>
            )}
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
