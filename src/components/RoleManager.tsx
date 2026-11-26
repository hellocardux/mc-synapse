import { useState } from 'react';
import { Users } from 'lucide-react';
import { getRaciRows, raciKeys } from '../lib/project';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

type RoleAction = { role: string; kind: 'rename' | 'remove' };

export function RoleManager() {
    const { t } = useLanguageStore();
    const state = useProjectStore();
    const [newRole, setNewRole] = useState('');
    const [action, setAction] = useState<RoleAction>();
    const [replacement, setReplacement] = useState('');
    const { roles } = state.meta;
    const copy = t.editor;
    const affected = action ? getRaciRows(state).filter(({ assignments }) =>
        raciKeys.some((key) => assignments[key].includes(action.role))) : [];
    const duplicate = roles.includes(newRole.trim());
    const invalidRename = !replacement.trim() || roles.includes(replacement.trim());

    function chooseAction(kind: RoleAction['kind'], role: string) {
        setAction({ role, kind });
        setReplacement(kind === 'rename' ? role : '');
    }

    return (
        <Dialog onOpenChange={(open) => { if (!open) setAction(undefined); }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2"><Users size={16} />{t.roleManager.button}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85dvh] max-w-xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t.roleManager.title}</DialogTitle>
                    <DialogDescription>{t.roleManager.description}</DialogDescription>
                </DialogHeader>
                <form className="flex items-start gap-2" onSubmit={(event) => {
                    event.preventDefault();
                    if (!newRole.trim() || duplicate) return;
                    state.addRole(newRole);
                    setNewRole('');
                }}>
                    <div className="flex-1">
                        <Input aria-label={copy.roleInput} placeholder={t.roleManager.placeholder} value={newRole} onChange={(event) => setNewRole(event.target.value)} />
                        {duplicate && <p className="mt-1 text-sm text-destructive">{copy.roleDuplicate}</p>}
                    </div>
                    <Button type="submit" disabled={!newRole.trim() || duplicate}>{copy.roleAdd}</Button>
                </form>
                {roles.length ? (
                    <ul className="max-h-56 divide-y overflow-y-auto rounded-lg border">
                        {roles.map((role) => (
                            <li key={role} className="flex flex-wrap items-center gap-2 px-3 py-1.5">
                                <span className="min-w-24 flex-1 break-all text-sm font-medium">{role}</span>
                                <Button size="sm" variant="ghost" onClick={() => chooseAction('rename', role)} aria-label={copy.roleRename + ' ' + role}>{copy.roleRename}</Button>
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => chooseAction('remove', role)} aria-label={copy.roleRemove + ' ' + role}>{copy.roleRemove}</Button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-muted-foreground">{copy.roleEmpty}</p>}
                {action && (
                    <form className="space-y-3 rounded-lg border bg-muted/40 p-4" onSubmit={(event) => {
                        event.preventDefault();
                        if (action.kind === 'rename' && invalidRename) return;
                        state.replaceRole(action.role, replacement, action.kind === 'rename');
                        setAction(undefined);
                    }}>
                        <h3 className="break-words font-semibold">
                            {action.kind === 'rename' ? copy.roleRename : copy.roleRemove} {action.role}
                        </h3>
                        {affected.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                                <p>{copy.roleAffected} ({affected.length})</p>
                                <ul className="mt-1 max-h-24 list-disc overflow-y-auto pl-5">
                                    {affected.map(({ id, label }) => <li key={id}>{label || copy.noLabel}</li>)}
                                </ul>
                            </div>
                        )}
                        {action.kind === 'rename' ? (
                            <Input aria-label={copy.roleInput} value={replacement} onChange={(event) => setReplacement(event.target.value)} autoFocus />
                        ) : affected.length > 0 && (
                            <label className="block space-y-2 text-sm">
                                <span>{copy.roleDecision}</span>
                                <select className="block h-9 w-full rounded-md border bg-background px-2" value={replacement}
                                    onChange={(event) => setReplacement(event.target.value)}>
                                    <option value="">{copy.roleClear}</option>
                                    {roles.filter((role) => role !== action.role).map((role) => <option key={role}>{role}</option>)}
                                </select>
                            </label>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setAction(undefined)}>{copy.cancel}</Button>
                            <Button type="submit" variant={action.kind === 'remove' ? 'destructive' : 'default'} disabled={action.kind === 'rename' && invalidRename}>
                                {action.kind === 'rename' ? copy.roleRename : copy.roleRemove}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
