import { useReactFlow } from '@xyflow/react';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { MultiSelect } from './ui/multi-select';
import { AlertCircle } from 'lucide-react';

export function PropertiesPanel() {
    const { } = useReactFlow();
    const { t } = useLanguageStore();

    // ... nodes selection ...
    const nodes = useProjectStore((state) => state.nodes);
    const edges = useProjectStore((state) => state.edges);
    const selectedNode = nodes.find((n) => n.selected);
    const selectedEdge = edges.find((e) => e.selected);

    const updateNodeData = useProjectStore((state) => state.updateNodeData);
    const updateEdgeLabel = useProjectStore((state) => state.updateEdgeLabel);
    const updateRaci = useProjectStore((state) => state.updateRaci);
    const raci = useProjectStore((state) => state.raci);
    const roles = useProjectStore((state) => state.meta.roles);

    const handleRaciChange = (type: 'R' | 'A' | 'C' | 'I', newRoles: string[]) => {
        if (selectedNode) {
            updateRaci(selectedNode.id, type, newRoles);
        }
    };

    if (selectedEdge) {
        return (
            <aside className="w-80 bg-background border-l border-border p-4">
                <div>
                    <h2 className="text-lg font-bold mb-4">{t.properties.title} (Edge)</h2>
                    <div className="space-y-2">
                        <Label htmlFor="edge-label">{t.properties.label}</Label>
                        <Input
                            id="edge-label"
                            value={(selectedEdge.label as string) || ''}
                            onChange={(e) => updateEdgeLabel(selectedEdge.id, e.target.value)}
                            autoFocus
                            placeholder={t.properties.edgeLabelPlaceholder}
                        />
                    </div>
                </div>
            </aside>
        );
    }

    if (!selectedNode) {
        return (
            <aside className="w-80 bg-background border-l border-border p-4">
                <div className="text-muted-foreground text-sm text-center mt-10">
                    {t.properties.selectNode}
                </div>
            </aside>
        );
    }

    const raciData = raci[selectedNode.id];
    const hasAccountable = raciData?.A?.length === 1;
    const accountableWarning = raciData?.A?.length === 0
        ? "Values in 'Accountable' are missing."
        : raciData?.A?.length && raciData.A.length > 1
            ? "Only one 'Accountable' is allowed."
            : null;

    return (
        <aside className="w-80 bg-background border-l border-border p-4 overflow-y-auto flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold mb-4">{t.properties.title}</h2>
                <div className="space-y-2">
                    <Label htmlFor="node-label">{t.properties.label}</Label>
                    <Input
                        id="node-label"
                        value={selectedNode.data.label as string}
                        onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                        autoFocus
                    />
                </div>

                {/* Tags Section */}
                {selectedNode.type === 'task' && (
                    <div className="space-y-3 pt-2 border-t">
                        <Label>{t.properties.indicators}</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tag-risk"
                                    checked={((selectedNode.data.tags as string[]) || []).includes('risk')}
                                    onCheckedChange={(checked: boolean) => {
                                        const currentTags = (selectedNode.data.tags as string[]) || [];
                                        const newTags = checked
                                            ? [...currentTags, 'risk']
                                            : currentTags.filter(t => t !== 'risk');
                                        updateNodeData(selectedNode.id, { tags: newTags });
                                    }}
                                />
                                <Label htmlFor="tag-risk" className="font-normal text-xs">{t.properties.risk}</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tag-control"
                                    checked={((selectedNode.data.tags as string[]) || []).includes('control')}
                                    onCheckedChange={(checked: boolean) => {
                                        const currentTags = (selectedNode.data.tags as string[]) || [];
                                        const newTags = checked
                                            ? [...currentTags, 'control']
                                            : currentTags.filter(t => t !== 'control');
                                        updateNodeData(selectedNode.id, { tags: newTags });
                                    }}
                                />
                                <Label htmlFor="tag-control" className="font-normal text-xs">{t.properties.control}</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tag-kpi"
                                    checked={((selectedNode.data.tags as string[]) || []).includes('kpi')}
                                    onCheckedChange={(checked: boolean) => {
                                        const currentTags = (selectedNode.data.tags as string[]) || [];
                                        const newTags = checked
                                            ? [...currentTags, 'kpi']
                                            : currentTags.filter(t => t !== 'kpi');
                                        updateNodeData(selectedNode.id, { tags: newTags });
                                    }}
                                />
                                <Label htmlFor="tag-kpi" className="font-normal text-xs">{t.properties.kpi}</Label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {raciData && (
                <div>
                    <h3 className="text-md font-semibold mb-3 border-b pb-1">{t.properties.raci}</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t.properties.r}</Label>
                            <MultiSelect
                                options={roles}
                                selected={raciData.R}
                                onChange={(vals) => handleRaciChange('R', vals)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className={!hasAccountable ? "text-destructive" : ""}>{t.properties.a}</Label>
                            <MultiSelect
                                options={roles}
                                selected={raciData.A}
                                onChange={(vals) => handleRaciChange('A', vals)}
                                className={!hasAccountable ? "border-destructive" : ""}
                            />
                            {accountableWarning && (
                                <div className="flex items-center gap-2 text-destructive text-xs mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{accountableWarning}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{t.properties.c}</Label>
                            <MultiSelect
                                options={roles}
                                selected={raciData.C}
                                onChange={(vals) => handleRaciChange('C', vals)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t.properties.i}</Label>
                            <MultiSelect
                                options={roles}
                                selected={raciData.I}
                                onChange={(vals) => handleRaciChange('I', vals)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
