import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const { t } = useLanguageStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                    setName("");
                    setEmail("");
                    setMessage("");
                }, 2000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-popover text-popover-foreground border-border sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto bg-muted p-3 rounded-full mb-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">{t.feedback.title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {t.feedback.subtitle}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 text-center text-green-500 animate-in fade-in zoom-in">
                        <div className="flex justify-center mb-4">
                            <Send className="h-12 w-12" />
                        </div>
                        <p className="text-lg font-medium">{t.feedback.success}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t.feedback.name}</Label>
                            <Input
                                id="name"
                                placeholder={t.feedback.namePlaceholder}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t.feedback.email}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t.feedback.emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">{t.feedback.message}</Label>
                            <Textarea
                                id="message"
                                placeholder={t.feedback.messagePlaceholder}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="bg-background min-h-[100px]"
                            />
                        </div>

                        {error && (
                            <p className="text-destructive text-sm text-center">{t.feedback.error}</p>
                        )}

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !name || !message}
                            >
                                {loading ? (
                                    <span className="animate-pulse">...</span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {t.feedback.submit}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
