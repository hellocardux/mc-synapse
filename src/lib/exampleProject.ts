import type { Edge, Node } from '@xyflow/react';
import { emptyAssignments, type ProjectData } from './project';

export function exampleProject(language: 'it' | 'en', projectName: string): ProjectData {
    const it = language === 'it';
    const labels = it
        ? ['Lista dealer ricevuta', 'Verificare l’elenco', 'Fatturare?', 'Emettere fattura', 'Sospendere e chiarire', 'Elenco aggiornato']
        : ['Dealer list received', 'Review the dealer list', 'Invoice?', 'Issue invoice', 'Hold and clarify', 'List updated'];
    const roles = ['Academy Operations', 'Network Development', 'Finance'];
    const nodes: Node[] = [
        { id: 'start', type: 'start-end', position: { x: 250, y: 15 }, data: { label: labels[0] } },
        { id: 'review', type: 'task', position: { x: 240, y: 115 }, data: { label: labels[1], tags: ['control'] } },
        { id: 'decision', type: 'decision', position: { x: 287, y: 220 }, data: { label: labels[2] } },
        { id: 'invoice', type: 'task', position: { x: 80, y: 355 }, data: { label: labels[3], tags: ['kpi'] } },
        { id: 'hold', type: 'task', position: { x: 425, y: 355 }, data: { label: labels[4], tags: ['risk'] } },
        { id: 'end', type: 'start-end', position: { x: 250, y: 485 }, data: { label: labels[5] } },
    ];
    const edges: Edge[] = [
        { id: 'start-review', source: 'start', target: 'review' },
        { id: 'review-decision', source: 'review', target: 'decision', targetHandle: 'top-target' },
        { id: 'yes', source: 'decision', sourceHandle: 'left-source', target: 'invoice', label: it ? 'Sì' : 'Yes' },
        { id: 'no', source: 'decision', sourceHandle: 'right-source', target: 'hold', label: 'No' },
        { id: 'invoice-end', source: 'invoice', target: 'end' },
        { id: 'hold-end', source: 'hold', target: 'end' },
    ];

    return {
        meta: {
            projectName,
            roles,
            owner: roles[0],
            purpose: it ? 'Emettere le fatture solo per i dealer verificati.' : 'Invoice dealers whose eligibility is confirmed.',
            triggers: labels[0],
            outputs: labels[5],
            kpis: it ? 'Percentuale di fatture emesse senza rilavorazioni.' : 'Share of invoices issued without rework.',
            risks: it ? 'Fattura emessa a un dealer da sospendere.' : 'Invoice issued to a dealer that should be on hold.',
        },
        nodes,
        edges,
        raci: {
            review: { ...emptyAssignments, R: [roles[0]], A: [roles[0]], C: roles.slice(1) },
            invoice: { ...emptyAssignments, R: [roles[2]], A: [roles[2]], I: [roles[0]] },
            hold: { ...emptyAssignments, R: [roles[0]], C: [roles[1]], I: [roles[2]] },
        },
        sipoc: [{
            suppliers: it ? 'Rete dealer' : 'Dealer network',
            inputs: labels[0],
            process: labels[1],
            outputs: it ? 'Elenco dealer approvato' : 'Approved dealer list',
            customers: roles[2],
        }],
    };
}
