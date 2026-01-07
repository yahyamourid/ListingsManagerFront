import React from 'react';
import { AlertTriangle, ArchiveRestore, Archive, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ArchiveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  listing,
  isLoading
}) {
  if (!isOpen || !listing) return null;

  const isArchived = listing.is_archived;

  const title = isArchived ? 'Restore Listing' : 'Archive Listing';
  const actionText = isArchived ? 'Restore' : 'Archive';
  const loadingText = isArchived ? 'Restoring...' : 'Archiving...';

  const description = isArchived
    ? 'This listing will be restored and become active again.'
    : 'This listing will be archived and hidden from active listings.';

  const Icon = isArchived ? ArchiveRestore : Archive;

  const accentBg = isArchived ? 'bg-emerald-500/10' : 'bg-destructive/10';
  const accentText = isArchived ? 'text-emerald-600' : 'text-destructive';
  const buttonVariant = isArchived ? 'default' : 'destructive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${accentBg}`}
          >
            <Icon className={`w-8 h-8 ${accentText}`} />
          </div>

          <h2 className="text-xl font-bold font-display text-foreground mb-2">
            {title}
          </h2>

          <p className="text-muted-foreground mb-6">
            Are you sure you want to {actionText.toLowerCase()} listing{' '}
            <strong>#{listing.id}</strong>
            {listing.address && (
              <span>
                {' '}
                at <strong>{listing.address}</strong>
              </span>
            )}
            ?
            <br />
            <span className="text-sm">{description}</span>
          </p>

          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              variant={buttonVariant}
              className="flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? loadingText : actionText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
