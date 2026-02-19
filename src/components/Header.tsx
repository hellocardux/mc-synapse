import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore'; // Import language store
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Toolbar } from './Toolbar';
import { RoleManager } from './RoleManager';
import { ProcessPassport } from './ProcessPassport';
import { Languages } from 'lucide-react';

export function Header() {
    const projectName = useProjectStore((state) => state.meta.projectName);
    const setProjectName = useProjectStore((state) => state.setProjectName);

    const { t, language, setLanguage } = useLanguageStore();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'it' : 'en');
    };

    return (
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-sm z-20 relative">
            <div className="flex items-center gap-3">
                <div className="text-3xl select-none">
                    🧠
                </div>
                <div className="flex flex-col justify-center mr-4">
                    <div className="font-bold text-lg tracking-tight leading-none">MC Synapse</div>
                    <div className="text-[10px] text-muted-foreground font-medium leading-tight mt-0.5">{t.header.subtitle}</div>
                </div>
                <Input
                    className="w-48 h-8 bg-background"
                    placeholder={t.header.projectPlaceholder}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleLanguage} title={language === 'en' ? "Switch to Italian" : "Switch to English"}>
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Toggle Language</span>
                </Button>

                <ProcessPassport />
                <div className="w-px h-8 bg-border bg-opacity-50" />
                <RoleManager />
                <div className="w-px h-8 bg-border bg-opacity-50" />

                {/* View Toggle */}
                <div className="flex bg-muted p-1 rounded-md">
                    <Button
                        variant={useProjectStore(s => s.currentView) === 'diagram' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => useProjectStore.getState().setView('diagram')}
                        className="h-7"
                    >
                        {t.header.map}
                    </Button>
                    <Button
                        variant={useProjectStore(s => s.currentView) === 'sipoc' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => useProjectStore.getState().setView('sipoc')}
                        className="h-7"
                    >
                        {t.header.sipoc}
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button
                        variant={useProjectStore(s => s.currentView) === 'docs' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => useProjectStore.getState().setView('docs')}
                        className="h-7"
                    >
                        {t.header.guide}
                    </Button>
                </div>

                <div className="w-px h-8 bg-border bg-opacity-50" />
                {/* Toolbar moved here for better layout */}
                <Toolbar />
            </div>
        </header>
    );
}
