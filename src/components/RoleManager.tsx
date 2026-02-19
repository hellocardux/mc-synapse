import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, X, Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';

export function RoleManager() {
    const roles = useProjectStore((state) => state.meta.roles);
    const addRole = useProjectStore((state) => state.addRole);
    const removeRole = useProjectStore((state) => state.removeRole);
    const { t } = useLanguageStore();
    const [newRole, setNewRole] = useState('');

    const handleAddRole = () => {
        if (newRole.trim() && !roles.includes(newRole.trim())) {
            addRole(newRole.trim());
            setNewRole('');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Users className="w-4 h-4" />
                    {t.roleManager.button}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.roleManager.title}</DialogTitle>
                    <DialogDescription>
                        {t.roleManager.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 my-4">
                    <Input
                        placeholder={t.roleManager.placeholder}
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                    />
                    <Button onClick={handleAddRole}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                    {roles.map((role) => (
                        <div key={role} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            <span>{role}</span>
                            <button
                                onClick={() => removeRole(role)}
                                className="hover:text-destructive ml-1 focus:outline-none"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
