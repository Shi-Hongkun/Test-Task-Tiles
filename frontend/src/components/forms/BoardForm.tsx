import React, { useState, useEffect } from 'react';
import { Board, BoardFormData } from '../../types';
import { Modal, Input, Textarea, Button } from '../ui';

interface BoardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BoardFormData) => Promise<void>;
  board?: Board | null;
  isLoading?: boolean;
}

export const BoardForm: React.FC<BoardFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  board,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<BoardFormData>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<BoardFormData>>({});

  // Initialize form data when board changes
  useEffect(() => {
    if (board) {
      setFormData({
        name: board.name,
        description: board.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
    setErrors({});
  }, [board, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BoardFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Board name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Board name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
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
      console.error('Error submitting board form:', error);
    }
  };

  const handleInputChange = (field: keyof BoardFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={board ? 'Edit Board' : 'Create New Board'}
      description={
        board
          ? 'Update your board details'
          : 'Create a new board to organize your tasks'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Board Name"
          placeholder="Enter board name..."
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          maxLength={100}
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Describe your board..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          rows={3}
          maxLength={500}
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
            {board ? 'Update Board' : 'Create Board'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
