import { useEffect } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';

export function MobileWarning() {
    const { t } = useLanguageStore();

    useEffect(() => {
        // Lock body scroll to prevent interaction with the underlying app
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
            document.body.style.height = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center md:hidden overscroll-none touch-none">
            <div className="text-7xl mb-6 animate-bounce">💻</div>
            <h1 className="text-3xl font-extrabold mb-4 text-primary tracking-tight">{t.mobileWarning.title}</h1>
            <p className="text-muted-foreground mb-10 text-lg max-w-sm mx-auto leading-relaxed font-medium">
                {t.mobileWarning.description}
            </p>
            <a
                href="https://cardux.it"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:scale-105 active:scale-95"
            >
                {t.mobileWarning.button}
            </a>
        </div>
    );
}
