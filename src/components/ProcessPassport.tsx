import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function ProcessPassport() {
    const { t } = useLanguageStore();
    const meta = useProjectStore((state) => state.meta);
    const setProjectMeta = useProjectStore((state) => state.setProjectMeta);
    const fields = [
        { key: 'purpose', label: t.passport.purpose, placeholder: t.passport.purposePlaceholder },
        { key: 'triggers', label: t.passport.inputsLabel, placeholder: t.passport.inputsPlaceholder },
        { key: 'outputs', label: t.passport.outputsLabel, placeholder: t.passport.outputsPlaceholder },
        { key: 'kpis', label: t.passport.kpis, placeholder: t.editor.kpiExample },
        { key: 'risks', label: t.editor.risks, placeholder: t.editor.riskExample },
    ] as const;

    return (
        <section className="mx-auto max-w-5xl px-6 py-9 lg:px-10">
            <h1 className="text-3xl font-semibold tracking-tight">{t.editor.passport}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.passport.description}</p>
            <div className="mt-7 grid gap-x-7 gap-y-6 rounded-xl border bg-card p-6 shadow-sm lg:grid-cols-2 lg:p-8">
                <div className="space-y-2">
                    <Label htmlFor="passport-owner">{t.passport.owner}</Label>
                    <Input
                        id="passport-owner"
                        aria-describedby="passport-owner-help"
                        value={meta.owner ?? ''}
                        onChange={(event) => setProjectMeta({ owner: event.target.value })}
                        placeholder={t.passport.ownerPlaceholder}
                    />
                    <p id="passport-owner-help" className="text-xs text-muted-foreground">{t.editor.ownerHelp}</p>
                </div>
                {fields.map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Textarea
                            id={key}
                            value={meta[key] ?? ''}
                            placeholder={placeholder}
                            onChange={(event) => setProjectMeta({ [key]: event.target.value })}
                        />
                    </div>
                ))}
                {meta.legacyKpisAndRisks !== undefined && (
                    <div className="space-y-2 border-t pt-4 lg:col-span-2">
                        <Label htmlFor="legacy-kpis">{t.editor.legacyKpisAndRisks}</Label>
                        <p id="legacy-kpis-help" className="text-sm text-muted-foreground">{t.editor.legacyHelp}</p>
                        <Textarea
                            id="legacy-kpis"
                            aria-describedby="legacy-kpis-help"
                            value={meta.legacyKpisAndRisks}
                            onChange={(event) => setProjectMeta({ legacyKpisAndRisks: event.target.value })}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
