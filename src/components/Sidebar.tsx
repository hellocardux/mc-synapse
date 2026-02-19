import { useState, type DragEvent } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { Guidance } from './Guidance';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

export function Sidebar() {
    const { t } = useLanguageStore();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-secondary p-4 border-r border-border shadow-md flex flex-col gap-4">
            <h2 className="text-lg font-bold">{t.sidebar.shapes}</h2>
            <div className="font-medium text-sm text-muted-foreground mb-2">{t.sidebar.drag}</div>

            <div
                className="p-3 bg-white border border-stone-400 rounded cursor-move flex items-center justify-center shadow-sm hover:ring-2 hover:ring-primary/20 transition-all"
                onDragStart={(event) => onDragStart(event, 'task')}
                draggable
            >
                {t.sidebar.task}
            </div>

            <div
                className="p-3 bg-white border border-stone-400 transform rotate-45 w-16 h-16 mx-auto cursor-move flex items-center justify-center shadow-sm hover:ring-2 hover:ring-primary/20 transition-all mb-4 mt-2"
                onDragStart={(event) => onDragStart(event, 'decision')}
                draggable
            >
                <span className="transform -rotate-45 text-xs">{t.sidebar.decision}</span>
            </div>

            <div
                className="p-3 bg-white border border-stone-400 rounded-full cursor-move flex items-center justify-center shadow-sm hover:ring-2 hover:ring-primary/20 transition-all"
                onDragStart={(event) => onDragStart(event, 'start-end')}
                draggable
            >
                {t.sidebar.startEnd}
            </div>

            <div className="mt-auto flex flex-col gap-4">
                <Guidance />

                <div className="pt-4 border-t border-border flex flex-col gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center gap-2 text-muted-foreground hover:text-primary"
                        onClick={() => setIsFeedbackOpen(true)}
                    >
                        <MessageSquare className="h-4 w-4" />
                        {t.feedback.trigger}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                        <a
                            href="https://cardux.it"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            {t.feedback.copyright}
                        </a>
                    </div>
                </div>
            </div>

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </aside>
    );
}
