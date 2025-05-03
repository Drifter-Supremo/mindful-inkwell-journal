import React from "react";
import { Button } from "./ui/button";

export default function DeleteEntryModal({ open, onConfirm, onCancel }: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-lg shadow-lg p-6 w-80">
        <h3 className="text-lg font-semibold mb-4 text-destructive">Delete Entry?</h3>
        <p className="mb-6 text-sm text-primary-foreground/80">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="px-4">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="px-4">Delete</Button>
        </div>
      </div>
    </div>
  );
}
