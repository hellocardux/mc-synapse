import { Diamond, PanelRight, RectangleHorizontal, Square, Trash2, type LucideIcon } from 'lucide-react';
import { type ProcessNodeType } from '../lib/project';
import { useLanguageStore } from '../store/useLanguageStore';
import { Button } from './ui/button';

interface MapToolbarProps {
    add: (type: ProcessNodeType) => void;
    showProperties: boolean;
    toggleProperties: () => void;
    hasMap: boolean;
    hasSelection: boolean;
    deleteSelection: () => void;
}

const shapeOptions: { type: ProcessNodeType; icon: LucideIcon; label: 'activity' | 'decision' | 'startEnd' }[] = [
    { type: 'task', icon: Square, label: 'activity' },
    { type: 'decision', icon: Diamond, label: 'decision' },
    { type: 'start-end', icon: RectangleHorizontal, label: 'startEnd' },
];

export function MapToolbar({ add, showProperties, toggleProperties, hasMap, hasSelection, deleteSelection }: MapToolbarProps) {
    const { t } = useLanguageStore();
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-card px-3 py-2 lg:px-5">
            <div className="flex items-center gap-1.5" role="group" aria-label={t.sidebar.shapes}>
                {shapeOptions.map(({ type, icon: Icon, label }) => (
                    <Button key={type} variant="outline" className="gap-1.5 px-2.5" draggable
                        onClick={() => add(type)}
                        onDragStart={(event) => {
                            event.dataTransfer.setData('application/reactflow', type);
                            event.dataTransfer.effectAllowed = 'move';
                        }}>
                        <Icon size={15} />{t.editor[label]}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-1">
                {hasSelection && (
                    <Button variant="ghost" className="gap-2 text-destructive hover:bg-red-50 hover:text-destructive"
                        aria-label={t.editor.deleteSelection} title={t.editor.deleteSelection} onClick={deleteSelection}>
                        <Trash2 size={16} />{t.editor.deleteConfirm}
                    </Button>
                )}
                <Button variant={showProperties ? 'secondary' : 'ghost'} className="gap-2" aria-pressed={showProperties}
                    disabled={!hasMap} onClick={toggleProperties}>
                    <PanelRight size={16} />{t.editor.properties}
                </Button>
            </div>
        </div>
    );
}
