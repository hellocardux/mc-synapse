import { Diamond, PanelRight, RectangleHorizontal, Square, type LucideIcon } from 'lucide-react';
import { type ProcessNodeType } from '../lib/project';
import { useLanguageStore } from '../store/useLanguageStore';
import { Button } from './ui/button';

interface MapToolbarProps {
    add: (type: ProcessNodeType) => void;
    showProperties: boolean;
    toggleProperties: () => void;
}

const shapeOptions: { type: ProcessNodeType; icon: LucideIcon; label: 'activity' | 'decision' | 'startEnd' }[] = [
    { type: 'task', icon: Square, label: 'activity' },
    { type: 'decision', icon: Diamond, label: 'decision' },
    { type: 'start-end', icon: RectangleHorizontal, label: 'startEnd' },
];

export function MapToolbar({ add, showProperties, toggleProperties }: MapToolbarProps) {
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
            <Button variant={showProperties ? 'secondary' : 'ghost'} className="gap-2" aria-pressed={showProperties} onClick={toggleProperties}>
                <PanelRight size={16} />{t.editor.properties}
            </Button>
        </div>
    );
}
