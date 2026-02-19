import { useLanguageStore } from '../store/useLanguageStore';

export function Guidance() {
    const { t } = useLanguageStore();



    // This block provides general guidance.
    return (
        <div className="bg-white/90 p-4 rounded-md shadow-sm border border-gray-200 text-sm mt-auto">
            <h4 className="font-bold mb-2 flex items-center gap-2">
                💡 {t.guidance.title}
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
                <li>{t.guidance.tip1}</li>
                <li>{t.guidance.tip2}</li>
                <li>{t.guidance.tip3}</li>
            </ul>
        </div>
    );
}
