import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useLanguageStore } from "../store/useLanguageStore";

export function Documentation() {
    const { t } = useLanguageStore();

    return (
        <div className="h-full w-full bg-background p-8 flex justify-center">
            <ScrollArea className="h-full w-full max-w-4xl pr-4">
                <div className="space-y-8 pb-20">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{t.documentation.title}</h1>
                        <p className="text-xl text-muted-foreground">
                            {t.documentation.subtitle}
                        </p>
                    </div>

                    <Separator />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">{t.documentation.section1}</h2>
                        <p className="leading-relaxed">
                            {t.documentation.section1_desc}
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>{t.passport.owner}:</strong> ...</li>
                            <li><strong>{t.passport.purpose}:</strong> ...</li>
                            <li><strong>{t.passport.triggers} & {t.passport.outputs}:</strong> ...</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">{t.documentation.section2}</h2>
                        <p className="leading-relaxed">
                            {t.documentation.section2_desc}
                        </p>
                        <div className="grid grid-cols-5 gap-2 text-sm border rounded-lg p-4 bg-muted/20">
                            <div className="font-bold text-center">{t.sipoc.suppliers}</div>
                            <div className="font-bold text-center">{t.sipoc.inputs}</div>
                            <div className="font-bold text-center">{t.sipoc.process}</div>
                            <div className="font-bold text-center">{t.sipoc.outputs}</div>
                            <div className="font-bold text-center">{t.sipoc.customers}</div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">{t.documentation.section3}</h2>
                        <p className="leading-relaxed">
                            {t.documentation.section3_desc}
                        </p>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="border p-4 rounded-lg flex flex-col items-center text-center gap-2">
                                <div className="w-24 h-10 border-2 border-primary rounded bg-white flex items-center justify-center text-xs font-bold">Activity</div>
                                <h3 className="font-bold">Task</h3>
                            </div>
                            <div className="border p-4 rounded-lg flex flex-col items-center text-center gap-2">
                                <div className="w-12 h-12 border-2 border-primary rotate-45 bg-white mb-2"></div>
                                <h3 className="font-bold">Decision</h3>
                            </div>
                            <div className="border p-4 rounded-lg flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 border-2 border-primary rounded-full bg-white"></div>
                                <h3 className="font-bold">Start / End</h3>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">{t.documentation.section4}</h2>
                        <p className="leading-relaxed">
                            {t.documentation.section4_desc}
                        </p>
                        <ul className="space-y-2 mt-2">
                            <li><span className="font-bold text-blue-600">R - Responsible</span></li>
                            <li><span className="font-bold text-red-600">A - Accountable</span></li>
                            <li><span className="font-bold text-green-600">C - Consulted</span></li>
                            <li><span className="font-bold text-yellow-600">I - Informed</span></li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">{t.documentation.section5}</h2>
                        <p className="leading-relaxed">
                            {t.documentation.section5_desc}
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-500 text-white p-1 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center">R</div>
                                <span><strong>{t.properties.risk}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-500 text-white p-1 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center">C</div>
                                <span><strong>{t.properties.control}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-green-600 text-white p-1 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center">K</div>
                                <span><strong>{t.properties.kpi}</strong></span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-primary">{t.documentation.section6}</h2>
                        <p className="leading-relaxed bg-yellow-50 p-4 rounded-md border border-yellow-200">
                            {t.documentation.section6_desc}
                        </p>
                        <ul className="space-y-3 mt-2 list-disc pl-5 text-muted-foreground">
                            <li>{t.documentation.tech_note1}</li>
                            <li>{t.documentation.tech_note2}</li>
                            <li>{t.documentation.tech_note3}</li>
                            <li>{t.documentation.tech_note4}</li>
                            <li>{t.documentation.tech_note5}</li>
                        </ul>
                    </section>
                </div>
            </ScrollArea >
        </div >
    );
}
