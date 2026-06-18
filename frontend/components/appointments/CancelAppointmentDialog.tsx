'use client';

import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
    id: number;
    loadingId: number | null;
    handleCancel: (id: number) => void;
}

export function CancelAppointmentDialog({ id, loadingId, handleCancel }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={loadingId === id}
                    className="text-sm text-destructive hover:underline disabled:opacity-50 px-0 hover:bg-transparent h-auto"
                >
                    {loadingId === id ? '...' : 'Cancel'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Don't cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancel(id)}>Yes, cancel</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
