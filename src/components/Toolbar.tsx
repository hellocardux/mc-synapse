import { useRef, useState } from 'react';
import { ChevronDown, Download, FileCode2, FileSpreadsheet, FileText, FolderOpen } from 'lucide-react';
import { parseProject, projectData, type ProjectData } from '../lib/project';
import { exportJson, exportRaci } from '../lib/projectExports';
import { useLanguageStore } from '../store/useLanguageStore';
import { useProjectStore } from '../store/useProjectStore';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function Toolbar({ openProject }: { openProject: (project: ProjectData) => void }) {
    const fileInput = useRef<HTMLInputElement>(null);
    const { t } = useLanguageStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');
    const copy = t.editor;

    async function readFile(file: File) {
        setError('');
        try {
            const project = parseProject(JSON.parse(await file.text()));
            openProject(project);
        } catch {
            setError(copy.invalidFile);
        }
    }

    async function download(format: 'json' | 'xlsx' | 'pdf') {
        setMenuOpen(false);
        setError('');
        setExporting(true);
        const project = projectData(useProjectStore.getState());
        try {
            if (format === 'json') exportJson(project, copy.untitled);
            if (format === 'xlsx') await exportRaci(project, copy.activity, copy.noLabel, copy.untitled);
            if (format === 'pdf') {
                const { exportProcessBook } = await import('../lib/processBook');
                exportProcessBook(project, t);
            }
        } catch {
            setError(copy.exportFailed);
        } finally {
            setExporting(false);
        }
    }

    return (
        <div className="relative flex shrink-0 items-center gap-2">
            <Button variant="outline" className="gap-2" aria-label={copy.openProject} onClick={() => fileInput.current?.click()}>
                <FolderOpen size={16} />{copy.open}
            </Button>
            <input ref={fileInput} type="file" className="hidden" accept=".json,application/json" onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) void readFile(file);
            }} />
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                    <Button className="gap-2" disabled={exporting}>
                        <Download size={16} />
                        {exporting ? copy.exporting : copy.export}
                        <ChevronDown size={14} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="grid w-64 gap-1 p-2">
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => void download('json')}><FileCode2 size={17} />{copy.exportJson}</Button>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => void download('xlsx')}><FileSpreadsheet size={17} />{copy.exportRaci}</Button>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => void download('pdf')}><FileText size={17} />{copy.exportPdf}</Button>
                </PopoverContent>
            </Popover>
            {error && (
                <div role="alert" className="absolute right-0 top-full z-40 mt-2 flex w-72 gap-2 rounded-md border border-destructive/25 bg-background p-3 text-sm text-destructive shadow-lg">
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError('')}>{copy.close}</Button>
                </div>
            )}
        </div>
    );
}
