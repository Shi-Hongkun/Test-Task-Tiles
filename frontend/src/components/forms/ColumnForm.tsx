import React, { useState, useEffect } from 'react';
import { ColumnWithTasks, ColumnFormData } from '../../types';
import { Modal, Input, Button } from '../ui';

interface ColumnFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ColumnFormData) => Promise<void>;
  column?: ColumnWithTasks | null;
  isLoading?: boolean;
}

export const ColumnForm: React.FC<ColumnFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  column,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ColumnFormData>({
    name: '',
  });
  const [errors, setErrors] = useState<Partial<ColumnFormData>>({});

  // Initialize form data when column changes
  useEffect(() => {
    if (column) {
      setFormData({
        name: column.name,
      });
    } else {
      setFormData({
        name: '',
      });
    }
    setErrors({});
  }, [column, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ColumnFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Column name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Column name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting column form:', error);
    }
  };

  const handleInputChange = (field: keyof ColumnFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={column ? 'Edit Column' : 'Create New Column'}
      description={
        column
          ? 'Update your column name'
          : 'Create a new column for organizing tasks'
      }
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Column Name"
          placeholder="Enter column name..."
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          maxLength={50}
          autoFocus
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {column ? 'Update Column' : 'Create Column'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
