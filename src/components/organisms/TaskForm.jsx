import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import RangeInput from "@/components/atoms/RangeInput";
import Checkbox from "@/components/atoms/Checkbox";
import RadioGroup from "@/components/atoms/RadioGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { cropService } from "@/services/api/cropService";

const TaskForm = ({ task, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    cropId: "",
    range_c: "",
    tags: "",
    checkbox_c: false,
    radio_c: "",
    website_c: "",
    internalExternal: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState([]);

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    if (task) {
setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        priority: task.priority || "medium",
        cropId: task.cropId?.toString() || "",
        range_c: task.range_c || "",
        tags: Array.isArray(task.tags) ? task.tags.join(", ") : task.tags || "",
        checkbox_c: Boolean(task.checkbox_c),
        radio_c: task.radio_c || "",
        website_c: task.website_c || "",
        internalExternal: task.internalExternal || ""
      });
    }
  }, [task]);

  const loadCrops = async () => {
    try {
      const cropsData = await cropService.getAll();
      setCrops(cropsData);
    } catch (error) {
      console.error("Failed to load crops:", error);
    }
  };

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (formData.website_c && formData.website_c.trim()) {
const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(formData.website_c.trim())) {
        newErrors.website_c = "Please enter a valid website URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        cropId: formData.cropId ? parseInt(formData.cropId) : null,
        farmId: "1", // Default farm ID
        completed: task ? task.completed : false,
        completedAt: task ? task.completedAt : null,
        range_c: formData.range_c,
        tags: formData.tags,
        checkbox_c: formData.checkbox_c,
        radio_c: formData.radio_c,
        website_c: formData.website_c,
        internalExternal: formData.internalExternal
      };

      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        savedTask = await taskService.create(taskData);
        toast.success("Task created successfully!");
      }
      
      onSave(savedTask);
    } catch (error) {
      toast.error("Failed to save task: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="CheckSquare" className="w-5 h-5 text-accent-600" />
          {task ? "Edit Task" : "Add New Task"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g., Water tomatoes, Apply fertilizer"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional task details..."
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
            />
            
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <Select
            label="Related Crop (Optional)"
            name="cropId"
            value={formData.cropId}
            onChange={handleChange}
          >
            <option value="">No specific crop</option>
            {crops.map(crop => (
              <option key={crop.Id} value={crop.Id}>
                {crop.name} {crop.variety ? `(${crop.variety})` : ""}
              </option>
            ))}
</Select>

          {/* Internal/External Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Type
            </label>
            <Select
              name="internalExternal"
              value={formData.internalExternal}
              onChange={handleChange}
              className="w-full"
            >
              <option value="">Select task type</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </Select>
          </div>
<div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Additional Task Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RangeInput
                label="Range"
                name="range_c"
                value={formData.range_c}
                onChange={handleChange}
                min={0}
                max={10}
                step={1}
                placeholder="Set min-max range"
              />

              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                helperText="Separate tags with commas"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Checkbox
                  name="checkbox_c"
                  checked={formData.checkbox_c}
                  onChange={(checked) => setFormData(prev => ({ ...prev, checkbox_c: checked }))}
                  label="Checkbox Option"
                />
              </div>

              <RadioGroup
                label="Radio Selection"
                name="radio_c"
                value={formData.radio_c}
                onChange={handleChange}
                options={[
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" }
                ]}
              />
            </div>

            <Input
              type="url"
              label="Website"
              name="website_c"
              value={formData.website_c}
              onChange={handleChange}
              error={errors.website_c}
              placeholder="https://example.com"
              helperText="Enter a valid website URL"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              )}
              {task ? "Update Task" : "Create Task"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;