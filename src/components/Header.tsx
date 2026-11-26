import { AlertCircle, BookOpen, CircleCheck, HardDrive, Languages, MessageSquare } from 'lucide-react';
import { useProjectStore, type AppView } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import type { ProjectData } from '../lib/project';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Toolbar } from './Toolbar';

export function Header({ openProject }: { openProject: (project: ProjectData) => void }) {
    const title = useProjectStore((state) => state.meta.projectName);
    const setProjectMeta = useProjectStore((state) => state.setProjectMeta);
    const currentView = useProjectStore((state) => state.currentView);
    const setView = useProjectStore((state) => state.setView);
    const draftStatus = useProjectStore((state) => state.draftStatus);
    const { t, language, setLanguage } = useLanguageStore();
    const copy = t.editor;
    const views: { id: AppView; label: string }[] = [
        { id: 'overview', label: copy.overview },
        { id: 'sipoc', label: t.header.sipoc },
        { id: 'diagram', label: t.header.map },
        { id: 'raci', label: 'RACI' },
    ];
    const warning = draftStatus !== 'ready' && draftStatus !== 'saved';
    const DraftIcon = warning ? AlertCircle : draftStatus === 'saved' ? CircleCheck : HardDrive;

    return (
        <header className="relative z-10 shrink-0 border-b bg-card">
            <div className="flex min-h-16 items-center gap-4 border-b border-border/70 px-4 lg:px-6">
                <div className="flex shrink-0 items-center gap-2.5">
                    <img src={import.meta.env.BASE_URL + 'synapse-mark.svg'} alt="" className="size-8" />
                    <span className="text-base font-semibold tracking-tight">MC Synapse</span>
                </div>
                <div className="min-w-0 flex-1 border-l pl-3 lg:pl-4">
                    <Input
                        aria-label={copy.project}
                        placeholder={copy.untitled}
                        className="max-w-96 border-transparent bg-transparent font-semibold shadow-none hover:border-input focus-visible:border-input"
                        value={title}
                        onChange={(event) => setProjectMeta({ projectName: event.target.value })}
                    />
                </div>
                <Toolbar openProject={openProject} />
            </div>
            <div className="flex items-center justify-between gap-1 px-4 lg:px-6">
                <nav className="flex shrink-0 gap-0.5" aria-label={copy.views}>
                    {views.map(({ id, label }) => (
                        <button
                            type="button"
                            key={id}
                            onClick={() => setView(id)}
                            aria-current={currentView === id ? 'page' : undefined}
                            className={'border-b-2 px-3 py-3 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring '
                                + (currentView === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground')}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="flex min-w-0 items-center gap-1.5 lg:gap-2">
                    <span role="status" className={'flex min-w-0 items-center gap-1.5 px-2 text-xs ' + (warning ? 'text-destructive' : 'text-muted-foreground')}>
                        <DraftIcon size={15} className="shrink-0" /><span>{copy[draftStatus]}</span>
                    </span>
                    <Button size="icon" variant={currentView === 'docs' ? 'secondary' : 'ghost'} aria-label={t.header.guide} title={t.header.guide} onClick={() => setView('docs')}>
                        <BookOpen size={17} />
                    </Button>
                    <Button asChild size="icon" variant="ghost">
                        <a href="mailto:hello@cardux.it?subject=MC%20Synapse%20Feedback" aria-label={t.feedback.trigger} title={t.feedback.trigger}><MessageSquare size={17} /></a>
                    </Button>
                    <Button size="icon" variant="ghost" aria-label={copy.language} title={copy.language} onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}>
                        <Languages size={17} />
                    </Button>
                </div>
            </div>
            {warning && (
                <p className="border-t bg-red-50 px-4 py-2 text-sm text-red-800 lg:px-6">
                    {draftStatus === 'conflict' ? copy.saveConflict : copy.saveUnavailable}
                </p>
            )}
        </header>
    );
}
