import { Plus, Trash2 } from 'lucide-react';
import { emptySipocRow, sipocKeys } from '../lib/project';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export function SipocTable() {
    const { t, language } = useLanguageStore();
    const sipoc = useProjectStore((state) => state.sipoc);
    const setSipoc = useProjectStore((state) => state.setSipoc);
    const showExamples = sipoc.length <= 1 && !sipoc.some((row) => sipocKeys.some((key) => row[key].trim()));
    const rows = sipoc.length ? sipoc : [emptySipocRow];

    return (
        <section className="mx-auto max-w-7xl px-6 py-9 lg:px-10">
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">{t.editor.sipocTitle}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{t.editor.sipocIntro}</p>
                </div>
                <Button onClick={() => setSipoc([...rows, emptySipocRow])} variant="outline" className="gap-2">
                    <Plus size={16} />{t.sipoc.add}
                </Button>
            </div>
            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <table className="w-full min-w-[710px] table-fixed text-left text-sm">
                    <colgroup>
                        {sipocKeys.map((key) => <col key={key} className={key === 'process' ? 'w-[26%] bg-primary/5' : undefined} />)}
                        <col className="w-12" />
                    </colgroup>
                    <thead className="border-b">
                        <tr>
                            {sipocKeys.map((key) => (
                                <th key={key} scope="col" className="px-3 py-4">
                                    {key === 'process' ? (language === 'it' ? 'Processo · Macrofase' : 'Process · Major step') : t.sipoc[key]}
                                </th>
                            ))}
                            <th scope="col"><span className="sr-only">{t.editor.sipocRemove}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b last:border-b-0">
                                {sipocKeys.map((field, columnIndex) => (
                                    <td key={field} className="p-2 align-top">
                                        <Textarea
                                            aria-label={t.sipoc[field] + ' · ' + (rowIndex + 1)}
                                            className="min-h-24 bg-background"
                                            placeholder={showExamples ? t.editor.sipocExample[columnIndex] : undefined}
                                            value={row[field]}
                                            onChange={(event) => setSipoc(rows.map((item, index) =>
                                                index === rowIndex ? { ...item, [field]: event.target.value } : item
                                            ))}
                                        />
                                    </td>
                                ))}
                                <td className="p-1 align-top">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-muted-foreground"
                                        aria-label={t.editor.sipocRemove + ' ' + (rowIndex + 1)}
                                        disabled={rows.length <= 1}
                                        onClick={() => setSipoc(rows.filter((_, index) => index !== rowIndex))}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
