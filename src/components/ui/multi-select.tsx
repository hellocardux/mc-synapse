import * as React from "react"
import { ChevronsUpDown, Check, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const handleSelect = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between h-auto min-h-10 py-2", className)}
                >
                    {selected.length === 0
                        ? <span className="text-muted-foreground">{placeholder}</span>
                        : (
                            <div className="flex flex-wrap gap-1 text-left">
                                {selected.map((item) => (
                                    <span key={item} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] font-medium border border-secondary-foreground/20">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2" align="start">
                <div className="flex items-center border-b px-3 pb-2 mb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-0 focus-visible:ring-0 px-0 h-8"
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">No item found.</div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ease-in-out duration-150",
                                    selected.includes(option) ? "bg-accent text-accent-foreground" : ""
                                )}
                            >
                                <div className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    selected.includes(option) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                )}>
                                    <Check className={cn("h-4 w-4")} />
                                </div>
                                {option}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
