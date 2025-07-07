import React, { useState, useEffect } from 'react';
import {
  Task,
  TaskFormData,
  Priority,
  ItemType,
  EstimateSize,
} from '../../types';
import { Modal, Input, Textarea, Button, Select } from '../ui';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  task?: Task | null;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectNumber: '',
    assignee: '',
    assigner: '',
    priority: undefined,
    itemType: undefined,
    initiative: '',
    estimateSize: undefined,
    startDate: '',
    deadline: '',
    tags: [],
  });
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        projectNumber: task.projectNumber || '',
        assignee: task.assignee || '',
        assigner: task.assigner || '',
        priority: task.priority,
        itemType: task.itemType,
        initiative: task.initiative || '',
        estimateSize: task.estimateSize,
        startDate: task.startDate ? task.startDate.split('T')[0] : '', // Format for date input
        deadline: task.deadline ? task.deadline.split('T')[0] : '', // Format for date input
        tags: task.tags || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectNumber: '',
        assignee: '',
        assigner: '',
        priority: undefined,
        itemType: undefined,
        initiative: '',
        estimateSize: undefined,
        startDate: '',
        deadline: '',
        tags: [],
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Task title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
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
      console.error('Error submitting task form:', error);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
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

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    handleInputChange('tags', tags);
  };

  // Options for select fields
  const priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.URGENT, label: 'Urgent' },
  ];

  const itemTypeOptions = [
    { value: ItemType.TASK, label: 'Task' },
    { value: ItemType.BUG, label: 'Bug' },
    { value: ItemType.FEATURE, label: 'Feature' },
    { value: ItemType.ENHANCEMENT, label: 'Enhancement' },
    { value: ItemType.PRODUCT_A, label: 'Product A' },
    { value: ItemType.PRODUCT_B, label: 'Product B' },
  ];

  const estimateSizeOptions = [
    { value: EstimateSize.XS, label: 'XS' },
    { value: EstimateSize.S, label: 'S' },
    { value: EstimateSize.M, label: 'M' },
    { value: EstimateSize.L, label: 'L' },
    { value: EstimateSize.XL, label: 'XL' },
    { value: EstimateSize.XXL, label: 'XXL' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      description={
        task ? 'Update your task details' : 'Create a new task in this column'
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-96 overflow-y-auto"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
            Basic Information
          </h3>

          <Input
            label="Task Title"
            placeholder="Enter task title..."
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            required
            maxLength={200}
            autoFocus
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Describe the task..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            rows={3}
            maxLength={1000}
          />
        </div>

        {/* Project Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
            Project Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Project Number"
              placeholder="e.g., Proj-123"
              value={formData.projectNumber || ''}
              onChange={(e) =>
                handleInputChange('projectNumber', e.target.value)
              }
            />

            <Input
              label="Initiative"
              placeholder="e.g., Mobile App"
              value={formData.initiative || ''}
              onChange={(e) => handleInputChange('initiative', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority || ''}
              onChange={(e) =>
                handleInputChange('priority', e.target.value as Priority)
              }
              options={priorityOptions}
              placeholder="Select priority..."
            />

            <Select
              label="Item Type"
              value={formData.itemType || ''}
              onChange={(e) =>
                handleInputChange('itemType', e.target.value as ItemType)
              }
              options={itemTypeOptions}
              placeholder="Select type..."
            />
          </div>
        </div>

        {/* Assignment */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
            Assignment
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Assignee"
              placeholder="Who is responsible?"
              value={formData.assignee || ''}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
            />

            <Input
              label="Assigner"
              placeholder="Who assigned this?"
              value={formData.assigner || ''}
              onChange={(e) => handleInputChange('assigner', e.target.value)}
            />
          </div>
        </div>

        {/* Planning */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
            Planning
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Estimate Size"
              value={formData.estimateSize || ''}
              onChange={(e) =>
                handleInputChange(
                  'estimateSize',
                  e.target.value as EstimateSize
                )
              }
              options={estimateSizeOptions}
              placeholder="Select size..."
            />

            <Input
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="e.g., urgent, frontend, api"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
