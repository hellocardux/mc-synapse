import { useState } from 'react';
import { getRaciRows, raciKeys } from '../lib/project';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { RaciAssignment } from './RaciAssignment';
import { RoleManager } from './RoleManager';

export function RaciTable() {
    const { t } = useLanguageStore();
    const state = useProjectStore();
    const [needsAccountable, setNeedsAccountable] = useState(false);
    const rows = getRaciRows(state);
    const incomplete = rows.filter(({ assignments }) => assignments.A.length !== 1);
    const visible = needsAccountable ? incomplete : rows;
    const labels = [t.properties.r, t.properties.a, t.properties.c, t.properties.i];

    return (
        <section className="mx-auto max-w-7xl px-6 py-9 lg:px-10">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">{t.editor.raciTitle}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{t.editor.raciIntro}</p>
                </div>
                <RoleManager />
            </div>
            {rows.length > 0 && (
                <label className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium">
                    <input type="checkbox" checked={needsAccountable} onChange={(event) => setNeedsAccountable(event.target.checked)}
                        className="size-4 accent-primary" />
                    {t.editor.raciFilter} <span className="rounded bg-muted px-1.5 text-muted-foreground">{incomplete.length}</span>
                </label>
            )}
            {visible.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                    <table className="w-full min-w-[735px] table-fixed text-left text-sm">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th scope="col" className="px-4 py-3.5">{t.editor.activity}</th>
                                {labels.map((label) => <th key={label} scope="col" className="px-3 py-3.5">{label}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(({ id, label }) => (
                                <tr key={id} className="border-b last:border-b-0">
                                    <th scope="row" className="break-words px-4 py-4 align-top font-medium">{label || t.editor.noLabel}</th>
                                    {raciKeys.map((type) => (
                                        <td key={type} className="px-2 py-2 align-top sm:px-3">
                                            <RaciAssignment nodeId={id} type={type} context={label || t.editor.noLabel} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                    {rows.length ? t.editor.raciFilteredEmpty : t.editor.raciEmpty}
                </p>
            )}
        </section>
    );
}
