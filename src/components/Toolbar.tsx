import { useRef } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Button } from './ui/button';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export function Toolbar() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguageStore();

    const state = useProjectStore();
    const { meta, nodes, raci, loadProject } = state;

    const handleSave = () => {
        const data = {
            meta: state.meta,
            nodes: state.nodes,
            edges: state.edges,
            raci: state.raci,
            sipoc: state.sipoc,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${meta.projectName || 'project'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                // Validate basic structure (optional)
                if (json.meta && json.nodes && json.edges && json.raci) {
                    loadProject(json);
                } else {
                    alert(t.common.invalidFileStructure);
                }
            } catch (err) {
                console.error('Failed to parse project file', err);
                alert(t.common.failedToParseFile);
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    const handleExportRaciExcel = () => {
        const raciRows = nodes
            .filter((n) => n.type === 'task')
            .map((node: any) => {
                const r = raci[node.id];
                return {
                    Task: node.data.label,
                    R: r?.R?.join(', ') || '',
                    A: r?.A?.join(', ') || '',
                    C: r?.C?.join(', ') || '',
                    I: r?.I?.join(', ') || '',
                };
            });

        const ws = XLSX.utils.json_to_sheet(raciRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'RACI Matrix');
        XLSX.writeFile(wb, `${meta.projectName || 'project'}_RACI.xlsx`);
    };

    const handleExportProcessBook = async () => {
        const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
        if (!viewport) return;

        try {
            // 1. Capture Map Image
            const dataUrl = await toPng(viewport, {
                backgroundColor: '#ffffff',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    width: '100%',
                    height: '100%',
                },
            });

            // 2. Initialize PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // --- COVER PAGE ---
            // Title
            let y = 20;
            pdf.setFontSize(24);
            pdf.setTextColor(33, 33, 33);
            pdf.text(meta.projectName || t.toolbar.untitledProcess, 20, y);
            y += 10;

            pdf.setFontSize(16);
            pdf.setTextColor(100, 100, 100);
            pdf.text(t.toolbar.processDefinitionDocument, 20, y);
            y += 20;

            // Passport Data
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);

            const addSection = (title: string, content: string) => {
                if (!content) return;
                pdf.setFont('helvetica', 'bold');
                pdf.text(title, 20, y);
                y += 7;
                pdf.setFont('helvetica', 'normal');

                const splitText = pdf.splitTextToSize(content, 170);
                pdf.text(splitText, 20, y);
                y += (splitText.length * 5) + 10;
            };

            addSection(t.passport.owner, meta.owner || t.common.notDefined);
            addSection(t.passport.purpose, meta.purpose || t.common.notDefined);
            addSection(t.passport.triggers, meta.triggers || '');
            addSection(t.passport.outputs, meta.outputs || '');
            addSection(t.passport.kpisRisks, meta.kpis || '');

            // --- MAP PAGE ---
            pdf.addPage('a4', 'landscape');
            pdf.setFontSize(16);
            pdf.text(t.toolbar.processMap, 10, 15);

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const ratio = imgProps.width / imgProps.height;
            const width = pdfWidth - 20;
            const height = width / ratio;

            pdf.addImage(dataUrl, 'PNG', 10, 10, width, height);

            // --- SIPOC PAGE ---
            /*
               Note: A full table is hard in pure jsPDF without plugins.
               We simply list that it exists in the JSON export for now.
            */

        } catch (err) {
            console.error('Export failed', err);
            alert(t.common.exportFailed);
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
                <Download className="w-4 h-4 mr-2" />
                {t.toolbar.saveJson}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {t.toolbar.loadJson}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleLoad}
                className="hidden"
                accept=".json"
            />
            <Button variant="outline" size="sm" onClick={handleExportRaciExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {t.toolbar.excel}
            </Button>
            <Button variant="default" size="sm" onClick={handleExportProcessBook}>
                <Download className="w-4 h-4 mr-2" />
                {t.toolbar.book}
            </Button>
        </div>
    );
}
