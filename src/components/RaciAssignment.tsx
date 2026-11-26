import { AlertCircle, ChevronDown } from 'lucide-react';
import { emptyAssignments, type RACIRole } from '../lib/project';
import { useLanguageStore } from '../store/useLanguageStore';
import { useProjectStore } from '../store/useProjectStore';
import { MultiSelect } from './ui/multi-select';

export function RaciAssignment({ nodeId, type, context }: { nodeId: string; type: RACIRole; context?: string }) {
    const { t } = useLanguageStore();
    const roles = useProjectStore((state) => state.meta.roles);
    const selected = useProjectStore((state) => (state.raci[nodeId] ?? emptyAssignments)[type]);
    const updateRaci = useProjectStore((state) => state.updateRaci);
    const name = { R: t.properties.r, A: t.properties.a, C: t.properties.c, I: t.properties.i }[type];
    const label = context ? name + ' · ' + context : name;
    const copy = t.editor.accountability;

    if (type !== 'A') {
        return (
            <MultiSelect
                label={label}
                options={roles}
                selected={selected}
                onChange={(values) => updateRaci(nodeId, type, values)}
                placeholder="—"
                searchLabel={t.editor.raciSearch}
                emptyLabel={t.editor.raciNoRole}
            />
        );
    }

    return (
        <div>
            <div className="relative">
                <select
                    aria-label={label}
                    value={selected.length === 1 ? 'role:' + selected[0] : selected.length > 1 ? 'multiple' : ''}
                    onChange={(event) => updateRaci(nodeId, 'A', event.target.value ? [event.target.value.slice(5)] : [])}
                    className="h-9 w-full appearance-none rounded-md border bg-background pl-2.5 pr-7 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                    disabled={!roles.length}
                >
                    <option value="">{selected.length ? copy.clear : copy.select}</option>
                    {selected.length > 1 && <option value="multiple" disabled>{copy.multipleOption}</option>}
                    {roles.map((role) => <option key={role} value={'role:' + role}>{role}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2 top-3 text-muted-foreground" />
            </div>
            {selected.length !== 1 && (
                <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-destructive">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{selected.length ? copy.multiple + ' · ' + selected.join(', ') : copy.missing}</span>
                </p>
            )}
        </div>
    );
}
