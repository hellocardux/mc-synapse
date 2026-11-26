import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    label: string;
    placeholder: string;
    searchLabel: string;
    emptyLabel: string;
}

export function MultiSelect({ options, selected, onChange, label, placeholder, searchLabel, emptyLabel }: MultiSelectProps) {
    const [search, setSearch] = useState('');
    const filtered = options.filter((role) => role.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

    return (
        <Popover onOpenChange={(open) => { if (!open) setSearch(''); }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-label={selected.length ? label + ': ' + selected.join(', ') : label}
                    className="h-auto min-h-9 w-full justify-between gap-2 whitespace-normal break-words px-2.5 py-1.5 text-left"
                    disabled={!options.length}
                >
                    <span className={selected.length ? 'min-w-0' : 'text-muted-foreground'}>
                        {selected.length ? selected.join(', ') : placeholder}
                    </span>
                    <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-2 p-3" align="start">
                <Input aria-label={searchLabel} placeholder={searchLabel} value={search} onChange={(event) => setSearch(event.target.value)} />
                <div className="max-h-60 overflow-y-auto" role="group" aria-label={label}>
                    {filtered.map((role) => (
                        <label key={role} className="flex cursor-pointer items-start gap-2 rounded px-2 py-2 text-sm hover:bg-accent">
                            <input
                                type="checkbox"
                                checked={selected.includes(role)}
                                className="mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-primary"
                                onChange={(event) => onChange(event.target.checked
                                    ? [...selected, role]
                                    : selected.filter((item) => item !== role))}
                            />
                            <span className="min-w-0 break-words">{role}</span>
                        </label>
                    ))}
                    {!filtered.length && <p className="px-2 py-3 text-sm text-muted-foreground">{emptyLabel}</p>}
                </div>
            </PopoverContent>
        </Popover>
    );
}
