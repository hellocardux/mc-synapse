import { useState } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { BookMarked, Save } from 'lucide-react';

export function ProcessPassport() {
    const { meta, setProjectMeta } = useProjectStore();
    const { t } = useLanguageStore();
    const [open, setOpen] = useState(false);

    // Local state for editing
    const [formData, setFormData] = useState({
        owner: meta.owner || '',
        purpose: meta.purpose || '',
        triggers: meta.triggers || '',
        outputs: meta.outputs || '',
        kpis: meta.kpis || '',
    });

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            // Re-sync with store when opening, in case it changed elsewhere
            setFormData({
                owner: meta.owner || '',
                purpose: meta.purpose || '',
                triggers: meta.triggers || '',
                outputs: meta.outputs || '',
                kpis: meta.kpis || '',
            });
        }
        setOpen(isOpen);
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setProjectMeta(formData);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <BookMarked className="h-4 w-4" />
                    {t.header.passport}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t.passport.title}</DialogTitle>
                    <DialogDescription>
                        {t.passport.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    {/* Owner */}
                    <div className="grid gap-2">
                        <Label htmlFor="owner">{t.passport.owner}</Label>
                        <Input
                            id="owner"
                            value={formData.owner}
                            onChange={(e) => handleChange('owner', e.target.value)}
                            placeholder={t.passport.ownerPlaceholder}
                        />
                    </div>

                    {/* Purpose */}
                    <div className="grid gap-2">
                        <Label htmlFor="purpose">{t.passport.purpose}</Label>
                        <Textarea
                            id="purpose"
                            value={formData.purpose}
                            onChange={(e) => handleChange('purpose', e.target.value)}
                            placeholder={t.passport.purposePlaceholder}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Triggers */}
                        <div className="grid gap-2">
                            <Label htmlFor="triggers">{t.passport.inputsLabel}</Label>
                            <Textarea
                                id="triggers"
                                placeholder={t.passport.inputsPlaceholder}
                                className="min-h-[100px]"
                                value={formData.triggers}
                                onChange={(e) => handleChange('triggers', e.target.value)}
                            />
                        </div>

                        {/* Outputs */}
                        <div className="grid gap-2">
                            <Label htmlFor="outputs">{t.passport.outputsLabel}</Label>
                            <Textarea
                                id="outputs"
                                placeholder={t.passport.outputsPlaceholder}
                                className="min-h-[100px]"
                                value={formData.outputs}
                                onChange={(e) => handleChange('outputs', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid gap-2">
                        <Label htmlFor="kpis">{t.passport.kpisLabel}</Label>
                        <Textarea
                            id="kpis"
                            placeholder={t.passport.kpisPlaceholder}
                            value={formData.kpis}
                            onChange={(e) => handleChange('kpis', e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Passport
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
