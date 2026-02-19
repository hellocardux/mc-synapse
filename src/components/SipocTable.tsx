import { Plus, Trash2 } from "lucide-react";
import { useProjectStore, type SipocData } from "../store/useProjectStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function SipocTable() {
    const { sipoc, setSipoc } = useProjectStore();
    const { t } = useLanguageStore();

    const handleUpdate = (index: number, field: keyof SipocData, value: string) => {
        const newData = [...sipoc];
        newData[index] = { ...newData[index], [field]: value };
        setSipoc(newData);
    };

    const handleAddRow = () => {
        setSipoc([
            ...sipoc,
            { suppliers: '', inputs: '', process: '', outputs: '', customers: '' }
        ]);
    };

    const handleRemoveRow = (index: number) => {
        if (sipoc.length === 1) return; // Keep at least one row
        const newData = sipoc.filter((_, i) => i !== index);
        setSipoc(newData);
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-background/50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">SIPOC Matrix</h2>
                    <p className="text-muted-foreground">
                        {t.documentation.section2_desc}
                    </p>
                </div>
                <Button onClick={handleAddRow}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.sipoc.add}
                </Button>
            </div>

            <div className="border rounded-md shadow-sm bg-card overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_auto] gap-px bg-border border-b text-sm font-medium text-muted-foreground">
                    <div className="p-3 bg-secondary/30">{t.sipoc.suppliers.toUpperCase()}</div>
                    <div className="p-3 bg-secondary/30">{t.sipoc.inputs.toUpperCase()}</div>
                    <div className="p-3 bg-secondary/30">{t.sipoc.process.toUpperCase()}</div>
                    <div className="p-3 bg-secondary/30">{t.sipoc.outputs.toUpperCase()}</div>
                    <div className="p-3 bg-secondary/30">{t.sipoc.customers.toUpperCase()}</div>
                    <div className="p-3 bg-secondary/30 w-12"></div>
                </div>

                {sipoc.map((row, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_auto] gap-px bg-border last:border-0 group">
                        <div className="bg-card">
                            <Textarea
                                value={row.suppliers}
                                onChange={(e) => handleUpdate(index, 'suppliers', e.target.value)}
                                className="border-0 focus-visible:ring-0 rounded-none h-full min-h-[80px] resize-none"
                                placeholder={t.sipoc.placeholder}
                            />
                        </div>
                        <div className="bg-card">
                            <Textarea
                                value={row.inputs}
                                onChange={(e) => handleUpdate(index, 'inputs', e.target.value)}
                                className="border-0 focus-visible:ring-0 rounded-none h-full min-h-[80px] resize-none"
                                placeholder={t.sipoc.placeholder}
                            />
                        </div>
                        <div className="bg-card">
                            <Textarea
                                value={row.process}
                                onChange={(e) => handleUpdate(index, 'process', e.target.value)}
                                className="border-0 focus-visible:ring-0 rounded-none h-full min-h-[80px] resize-none font-medium"
                                placeholder={t.sipoc.placeholder}
                            />
                        </div>
                        <div className="bg-card">
                            <Textarea
                                value={row.outputs}
                                onChange={(e) => handleUpdate(index, 'outputs', e.target.value)}
                                className="border-0 focus-visible:ring-0 rounded-none h-full min-h-[80px] resize-none"
                                placeholder={t.sipoc.outputsPlaceholder}
                            />
                        </div>
                        <div className="bg-card">
                            <Textarea
                                value={row.customers}
                                onChange={(e) => handleUpdate(index, 'customers', e.target.value)}
                                className="border-0 focus-visible:ring-0 rounded-none h-full min-h-[80px] resize-none"
                                placeholder={t.sipoc.customersPlaceholder}
                            />
                        </div>
                        <div className="bg-card flex items-center justify-center p-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRow(index)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={sipoc.length === 1}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
