import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EDITABLE_FIELDS = [
  { key: 'current_price', label: 'Current Price', icon: DollarSign, type: 'number' },
  { key: 'status', label: 'Status', icon: Tag, type: 'select', options: ['available', 'pending', 'sold'] },
  { key: 'sale_date', label: 'Sale Date', icon: Calendar, type: 'date' },
];

export function EditorFieldEditModal({ isOpen, onClose, listing, onSubmit, isLoading }) {
  const [selectedField, setSelectedField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    // Set current value
    if (field.key === 'status') {
      setFieldValue(listing?.is_sold ? 'sold' : (listing?.status || 'available'));
    } else if (field.key === 'sale_date') {
      setFieldValue(listing?.sale_date || '');
    } else {
      setFieldValue(listing?.[field.key] || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedField) return;

    let processedValue = fieldValue;
    let oldValue = listing?.[selectedField.key];

    if (selectedField.key === 'current_price') {
      processedValue = parseFloat(fieldValue) || 0;
      oldValue = listing?.current_price || 0;
    } else if (selectedField.key === 'status') {
      oldValue = listing?.is_sold ? 'sold' : (listing?.status || 'available');
    } else if (selectedField.key === 'sale_date') {
      oldValue = listing?.sale_date || null;
      processedValue = fieldValue || null;
    }

    onSubmit({
      field: selectedField.key,
      oldValue,
      newValue: processedValue,
    });

    setSelectedField(null);
    setFieldValue('');
  };

  const handleClose = () => {
    setSelectedField(null);
    setFieldValue('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold font-display text-foreground">
            Edit Listing Field
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Select one field to update. Changes are tracked for audit purposes.
          </p>

          {!selectedField ? (
            <div className="space-y-3">
              {EDITABLE_FIELDS.map((field) => (
                <button
                  key={field.key}
                  onClick={() => handleFieldSelect(field)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <field.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {field.key === 'current_price' 
                        ? `$${(listing?.current_price || 0).toLocaleString()}`
                        : field.key === 'status'
                        ? (listing?.is_sold ? 'Sold' : (listing?.status || 'Available'))
                        : (listing?.sale_date || 'Not set')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
                <selectedField.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{selectedField.label}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setSelectedField(null)}
                >
                  Change
                </Button>
              </div>

              <div>
                <Label htmlFor="fieldValue">New Value</Label>
                {selectedField.type === 'select' ? (
                  <Select value={fieldValue} onValueChange={setFieldValue}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedField.options.map(option => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="fieldValue"
                    type={selectedField.type}
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={`Enter new ${selectedField.label.toLowerCase()}`}
                    className="mt-1.5"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-gradient" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Update Field'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
