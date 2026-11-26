import { encodeProject, getRaciRows, type ProjectData } from './project';

export function projectFileName(name: string, fallback: string): string {
    return (name.trim() || fallback).replace(/[<>:"/\\|?*]/g, '-').slice(0, 120);
}

export function exportJson(project: ProjectData, fallback: string) {
    const blob = new Blob([encodeProject(project, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = projectFileName(project.meta.projectName, fallback) + '.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function exportRaci(project: ProjectData, activity: string, noLabel: string, fallback: string) {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.aoa_to_sheet([
        [activity, 'R', 'A', 'C', 'I'],
        ...getRaciRows(project).map(({ label, assignments }) => [
            label || noLabel, assignments.R.join(', '), assignments.A.join(', '),
            assignments.C.join(', '), assignments.I.join(', '),
        ]),
    ]);
    worksheet['!cols'] = [{ wch: 34 }, { wch: 26 }, { wch: 26 }, { wch: 26 }, { wch: 26 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RACI');
    XLSX.writeFile(workbook, projectFileName(project.meta.projectName, fallback) + '_RACI.xlsx');
}
