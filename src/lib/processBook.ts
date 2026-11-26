import { getBezierPath, Position, type Node, type XYPosition } from '@xyflow/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { useLanguageStore } from '../store/useLanguageStore';
import { getRaciRows, sipocKeys, type ProjectData } from './project';
import { projectFileName } from './projectExports';

type Copy = ReturnType<typeof useLanguageStore.getState>['t'];
type MapNode = Node & { w: number; h: number; text: string[] };
const margin = 13;
const headerHeight = 27;
const teal = '#115e59';
const ink = '#172a3b';
const lineColor = '#53677b';

function sectionTitle(doc: jsPDF, title: string) {
    doc.setFont('helvetica', 'bold').setFontSize(18).setTextColor(ink);
    doc.text(title, margin, 17);
}

function addPassport(doc: jsPDF, project: ProjectData, t: Copy) {
    const { meta } = project;
    doc.setFont('helvetica', 'bold').setFontSize(23).setTextColor(ink);
    doc.text(t.toolbar.book, margin, 21);
    const title = doc.splitTextToSize(meta.projectName || t.editor.untitled, 180) as string[];
    autoTable(doc, {
        startY: 29,
        margin,
        theme: 'plain',
        body: title.map((line) => [line]),
        styles: { fontSize: 17, textColor: teal, cellPadding: 1.5 },
    });

    autoTable(doc, {
        margin: { top: margin, right: margin, bottom: 18, left: margin },
        head: [[{ content: t.editor.passport, colSpan: 2 }]],
        body: [
            [t.passport.owner, meta.owner || '—'],
            [t.passport.purpose, meta.purpose || '—'],
            [t.passport.triggers, meta.triggers || '—'],
            [t.passport.outputs, meta.outputs || '—'],
            [t.passport.kpis, meta.kpis || '—'],
            [t.editor.risks, meta.risks || '—'],
            ...(meta.legacyKpisAndRisks ? [[t.editor.legacyKpisAndRisks, meta.legacyKpisAndRisks]] : []),
        ],
        columnStyles: { 0: { cellWidth: 45, fontStyle: 'bold' } },
        headStyles: { fillColor: teal },
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
    });
}

function addTable(doc: jsPDF, title: string, headers: string[], rows: string[][], noData: string) {
    doc.addPage('a4', 'landscape');
    autoTable(doc, {
        startY: headerHeight,
        margin: { top: headerHeight, right: margin, bottom: 18, left: margin },
        head: [headers],
        body: rows.length ? rows : [[{ content: noData, colSpan: headers.length }]],
        headStyles: { fillColor: teal },
        styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
        willDrawPage: () => sectionTitle(doc, title),
    });
}

function mapNode(doc: jsPDF, node: Node): MapNode {
    const decision = node.type === 'decision';
    const startEnd = node.type === 'start-end';
    const w = decision ? 104 : startEnd ? 158 : 176;
    const maxText = decision ? 76 : w - 26;
    doc.setFont('helvetica', 'bold').setFontSize(decision ? 9 : 10);
    const text = doc.splitTextToSize(String(node.data.label), maxText * 0.25) as string[];
    const h = Math.max(decision ? 104 : startEnd ? 44 : 52, text.length * 15 + (decision ? 54 : 22));
    return { ...node, w, h, text };
}

function anchor(node: MapNode, handle: string | null | undefined, source: boolean) {
    const { x, y } = node.position;
    const side = node.type === 'decision' ? handle?.split('-')[0] : undefined;
    if (side === 'left') return { x, y: y + node.h / 2, side: Position.Left };
    if (side === 'right') return { x: x + node.w, y: y + node.h / 2, side: Position.Right };
    if (side === 'top' || (!side && !source)) return { x: x + node.w / 2, y, side: Position.Top };
    return { x: x + node.w / 2, y: y + node.h, side: Position.Bottom };
}

function addMap(doc: jsPDF, project: ProjectData, t: Copy) {
    doc.addPage('a4', 'landscape');
    if (!project.nodes.length) {
        sectionTitle(doc, t.toolbar.processMap);
        doc.setFont('helvetica', 'normal').setFontSize(11).text(t.editor.noData, margin, headerHeight);
        return;
    }

    const nodes = project.nodes.map((node) => mapNode(doc, node));
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const edges = project.edges.flatMap((edge) => {
        const sourceNode = byId.get(edge.source);
        const targetNode = byId.get(edge.target);
        if (!sourceNode || !targetNode) return [];

        const source = anchor(sourceNode, edge.sourceHandle, true);
        const target = anchor(targetNode, edge.targetHandle, false);
        const [path, labelX, labelY] = getBezierPath({
            sourceX: source.x, sourceY: source.y, sourcePosition: source.side,
            targetX: target.x, targetY: target.y, targetPosition: target.side,
        });
        const [, , c1x, c1y, c2x, c2y] = path.slice(1).replace('C', ' ').split(/[,\s]+/).map(Number);
        return [{
            source, control1: { x: c1x, y: c1y }, control2: { x: c2x, y: c2y }, target,
            label: String(edge.label ?? ''), labelX, labelY,
        }];
    });

    doc.setFont('helvetica', 'normal').setFontSize(9);
    const points = [
        ...nodes.flatMap(({ position, w, h }) => [position, { x: position.x + w, y: position.y + h }]),
        ...edges.flatMap(({ control1, control2, label, labelX, labelY }) => {
            const halfLabel = label ? doc.getTextWidth(label) / 0.5 + 8 : 0;
            return [control1, control2, { x: labelX - halfLabel, y: labelY }, { x: labelX + halfLabel, y: labelY }];
        }),
    ];
    const bounds = points.reduce((box, point) => ({
        minX: Math.min(box.minX, point.x), minY: Math.min(box.minY, point.y),
        maxX: Math.max(box.maxX, point.x), maxY: Math.max(box.maxY, point.y),
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    const minX = bounds.minX - 24;
    const minY = bounds.minY - 24;
    const width = bounds.maxX - minX + 24;
    const height = bounds.maxY - minY + 24;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight() - headerHeight - 18;
    const fitScale = Math.min(pageWidth / width, pageHeight / height);

    function draw(scale: number, originX: number, originY: number, title: string) {
        sectionTitle(doc, title);
        doc.saveGraphicsState();
        doc.rect(margin, headerHeight, pageWidth, pageHeight, null).clip().discardPath();

        const x = (worldX: number) => margin + (worldX - originX) * scale;
        const y = (worldY: number) => headerHeight + (worldY - originY) * scale;
        const coords = (point: XYPosition) => [x(point.x), y(point.y)];
        doc.setDrawColor(lineColor).setFillColor(lineColor).setLineWidth(Math.max(0.12, scale));
        for (const edge of edges) {
            doc.path([
                { op: 'm', c: coords(edge.source) },
                { op: 'c', c: [...coords(edge.control1), ...coords(edge.control2), ...coords(edge.target)] },
            ]).stroke();
            const tx = x(edge.target.x);
            const ty = y(edge.target.y);
            const angle = Math.atan2(edge.target.y - edge.control2.y, edge.target.x - edge.control2.x);
            const backX = tx - Math.cos(angle) * scale * 9;
            const backY = ty - Math.sin(angle) * scale * 9;
            const crossX = -Math.sin(angle) * scale * 4;
            const crossY = Math.cos(angle) * scale * 4;
            doc.triangle(tx, ty, backX + crossX, backY + crossY, backX - crossX, backY - crossY, 'F');
        }

        for (const node of nodes) {
            const nx = x(node.position.x);
            const ny = y(node.position.y);
            const nw = node.w * scale;
            const nh = node.h * scale;
            const decision = node.type === 'decision';
            const missing = node.type === 'task' && project.raci[node.id]?.A?.length !== 1;
            doc.setDrawColor(missing ? '#b4232a' : teal).setFillColor(node.type === 'task' ? '#ffffff' : '#f0fdfa');
            if (decision) {
                doc.path([
                    { op: 'm', c: [nx + nw / 2, ny] },
                    { op: 'l', c: [nx + nw, ny + nh / 2] },
                    { op: 'l', c: [nx + nw / 2, ny + nh] },
                    { op: 'l', c: [nx, ny + nh / 2] },
                    { op: 'h', c: [] },
                ]).fillStroke();
            } else {
                const radius = node.type === 'start-end' ? nh / 2 : 7 * scale;
                doc.roundedRect(nx, ny, nw, nh, radius, radius, 'FD');
            }

            doc.setFont('helvetica', 'bold').setFontSize((decision ? 30 : 34) * scale).setTextColor(ink);
            node.text.forEach((text, index) => {
                const offset = (index - (node.text.length - 1) / 2) * 14 * scale;
                doc.text(text, nx + nw / 2, ny + nh / 2 + offset, { align: 'center', baseline: 'middle' });
            });
            const tags = (node.data.tags as string[] | undefined) ?? [];
            const tagText = tags.filter((tag) => tag === 'kpi' || tag === 'control' || tag === 'risk')
                .map((tag) => t.properties[tag as 'kpi' | 'control' | 'risk']).join(' · ');
            if (tagText) {
                doc.setFont('helvetica', 'normal').setFontSize(23 * scale).setTextColor(teal);
                doc.text(tagText, nx + 6 * scale, ny - 3 * scale);
            }
        }

        doc.setFont('helvetica', 'normal').setFontSize(28 * scale).setTextColor(ink);
        for (const edge of edges) {
            if (!edge.label) continue;
            const lx = x(edge.labelX);
            const ly = y(edge.labelY);
            const labelWidth = doc.getTextWidth(edge.label) + 10 * scale;
            doc.setFillColor('#ffffff').rect(lx - labelWidth / 2, ly - 7 * scale, labelWidth, 14 * scale, 'F');
            doc.text(edge.label, lx, ly, { align: 'center', baseline: 'middle' });
        }
        doc.restoreGraphicsState();
    }

    if (fitScale >= 0.24) {
        draw(Math.min(fitScale, 0.52), minX, minY, t.toolbar.processMap);
        return;
    }

    draw(fitScale, minX, minY, t.editor.mapOverview);
    // Page overlap makes connectors easier to follow across sheet boundaries.
    const overlap = 10;
    const scale = Math.min(0.29, (pageWidth - overlap) * 5 / width, (pageHeight - overlap) * 5 / height);
    const stepX = (pageWidth - overlap) / scale;
    const stepY = (pageHeight - overlap) / scale;
    const columns = Math.max(1, Math.ceil((width * scale - overlap) / (pageWidth - overlap)));
    const rows = Math.max(1, Math.ceil((height * scale - overlap) / (pageHeight - overlap)));
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            doc.addPage('a4', 'landscape');
            draw(scale, minX + column * stepX, minY + row * stepY, t.editor.mapPage + ' ' + (row * columns + column + 1) + '/' + (rows * columns));
        }
    }
}

export function exportProcessBook(project: ProjectData, t: Copy) {
    const doc = new jsPDF({ format: 'a4', compress: true });
    addPassport(doc, project, t);
    addTable(doc, t.editor.sipocTitle, sipocKeys.map((key) => t.sipoc[key]),
        project.sipoc.filter((row) => sipocKeys.some((key) => row[key].trim())).map((row) => sipocKeys.map((key) => row[key])),
        t.editor.noData);
    addMap(doc, project, t);
    addTable(doc, t.properties.raci, [t.editor.activity, t.properties.r, t.properties.a, t.properties.c, t.properties.i],
        getRaciRows(project).map(({ label, assignments }) => [
            label || t.editor.noLabel, assignments.R.join(', '), assignments.A.join(', '), assignments.C.join(', '), assignments.I.join(', '),
        ]), t.editor.noData);

    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page++) {
        doc.setPage(page).setFont('helvetica', 'normal').setFontSize(8).setTextColor(lineColor);
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.text('MC Synapse', margin, height - 8);
        doc.text(page + ' / ' + pages, width - margin, height - 8, { align: 'right' });
    }
    doc.save(projectFileName(project.meta.projectName, t.editor.untitled) + '_Process_Book.pdf');
}
