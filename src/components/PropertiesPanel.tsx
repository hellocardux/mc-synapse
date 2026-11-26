import { X } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { raciKeys } from '../lib/project';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RaciAssignment } from './RaciAssignment';
import { RoleManager } from './RoleManager';

export function PropertiesPanel({ close }: { close: () => void }) {
    const { t } = useLanguageStore();
    const state = useProjectStore();
    const node = state.nodes.find((item) => item.selected);
    const edge = state.edges.find((item) => item.selected);
    const task = node?.type === 'task';
    const tags = node?.data.tags as string[] | undefined ?? [];
    const labels = [t.properties.r, t.properties.a, t.properties.c, t.properties.i];

    return (
        <aside aria-label={t.editor.properties} className="w-64 shrink-0 overflow-y-auto border-l bg-card px-4 pb-5 lg:w-72 lg:px-5">
            <div className="sticky top-0 z-10 mb-3 flex items-center justify-between gap-2 border-b bg-card py-2">
                <h2 className="font-semibold">{edge ? t.editor.edge : t.editor.properties}</h2>
                <Button size="icon" variant="ghost" onClick={close} aria-label={t.editor.close} title={t.editor.close}><X size={16} /></Button>
            </div>
            {edge ? (
                <div className="space-y-2">
                    <Label htmlFor="edge-label">{t.properties.label}</Label>
                    <Input id="edge-label" value={String(edge.label ?? '')} placeholder={t.properties.edgeLabelPlaceholder}
                        onChange={(event) => state.updateEdgeLabel(edge.id, event.target.value)} />
                </div>
            ) : node ? (
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="node-label">{t.properties.label}</Label>
                        <Input id="node-label" value={String(node.data.label)} onChange={(event) => state.updateNodeData(node.id, { label: event.target.value })} />
                    </div>
                    {task && (
                        <>
                            <fieldset className="border-t pt-2">
                                <legend className="pr-2 text-sm font-medium">{t.properties.indicators}</legend>
                                <div className="flex flex-wrap gap-x-3 gap-y-2">
                                    {(['risk', 'control', 'kpi'] as const).map((tag) => (
                                        <label key={tag} className="flex cursor-pointer items-center gap-1.5 text-sm">
                                            <input
                                                type="checkbox"
                                                className="size-4 accent-primary"
                                                checked={tags.includes(tag)}
                                                onChange={(event) => state.updateNodeData(node.id, {
                                                    tags: event.target.checked ? [...tags, tag] : tags.filter((value) => value !== tag),
                                                })}
                                            />
                                            {t.properties[tag]}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            <div className="space-y-3 border-t pt-3">
                                <h3 className="font-semibold">RACI</h3>
                                {state.meta.roles.length ? raciKeys.map((type, index) => (
                                    <div key={type} className="space-y-1.5">
                                        <p className="text-sm font-medium">{labels[index]}</p>
                                        <RaciAssignment nodeId={node.id} type={type} />
                                    </div>
                                )) : (
                                    <>
                                        <p className="text-sm text-muted-foreground">{t.editor.raciNoRoles}</p>
                                        <RoleManager />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : <p className="text-sm text-muted-foreground">{t.editor.selectedHelp}</p>}
        </aside>
    );
}
