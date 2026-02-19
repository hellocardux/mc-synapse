import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useProjectStore } from '../../store/useProjectStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export function TaskNode({ id, data }: NodeProps) {
    const raci = useProjectStore((state) => state.raci[id]);
    const { t } = useLanguageStore();
    const hasAccountable = raci?.A?.length === 1;
    const tags = (data.tags as string[]) || [];

    return (
        <div className={`p-2 shadow-md rounded-md bg-white border-2 min-w-[150px] ${hasAccountable ? 'border-stone-400' : 'border-red-500'} relative group`}>
            {/* Indicators */}
            <div className="absolute -top-3 left-2 flex gap-1">
                {tags.includes('risk') && (
                    <div className="bg-orange-500 text-white p-0.5 rounded-full shadow-sm" title={t.tooltips.risk}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                )}
                {tags.includes('control') && (
                    <div className="bg-blue-500 text-white p-0.5 rounded-full shadow-sm" title={t.tooltips.control}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                )}
                {tags.includes('kpi') && (
                    <div className="bg-green-600 text-white p-0.5 rounded-full shadow-sm" title={t.tooltips.kpi}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    </div>
                )}
            </div>

            <div className="font-bold text-sm text-center">{data.label as string}</div>
            {!hasAccountable && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border border-white z-10" title={t.tooltips.missingAccountable} />
            )}
            <Handle type="target" position={Position.Top} className="w-2 h-2" />
            <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        </div>
    );
}
