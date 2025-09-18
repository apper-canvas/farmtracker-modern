import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { subtaskService } from "@/services/api/subtaskService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [subtasks, setSubtasks] = React.useState([]);
  const [subtasksLoading, setSubtasksLoading] = React.useState(false);
  const [showSubtasks, setShowSubtasks] = React.useState(false);
  const [newSubtaskName, setNewSubtaskName] = React.useState("");
  const [addingSubtask, setAddingSubtask] = React.useState(false);

  // Load subtasks when component mounts or showSubtasks changes
  React.useEffect(() => {
    if (showSubtasks && task.Id) {
      loadSubtasks();
    }
  }, [showSubtasks, task.Id]);

  const loadSubtasks = async () => {
    setSubtasksLoading(true);
    try {
      const data = await subtaskService.getByTaskId(task.Id);
      setSubtasks(data);
    } catch (error) {
      console.error("Failed to load subtasks:", error);
      toast.error("Failed to load subtasks");
    } finally {
      setSubtasksLoading(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskName.trim()) return;

    setAddingSubtask(true);
    try {
      const newSubtask = await subtaskService.create({
        name: newSubtaskName.trim(),
        taskId: task.Id
      });
      setSubtasks(prev => [...prev, newSubtask]);
      setNewSubtaskName("");
      toast.success("Subtask added successfully");
    } catch (error) {
      console.error("Failed to add subtask:", error);
      toast.error("Failed to add subtask");
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId, completed) => {
    try {
      const subtask = subtasks.find(s => s.Id === subtaskId);
      const updatedSubtask = await subtaskService.update(subtaskId, {
        ...subtask,
        completed
      });
      setSubtasks(prev => prev.map(s => s.Id === subtaskId ? updatedSubtask : s));
      toast.success(completed ? "Subtask completed!" : "Subtask marked as pending");
    } catch (error) {
      console.error("Failed to update subtask:", error);
      toast.error("Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!confirm("Are you sure you want to delete this subtask?")) return;

    try {
      await subtaskService.delete(subtaskId);
      setSubtasks(prev => prev.filter(s => s.Id !== subtaskId));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    }
  };
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
task.completed ? "opacity-75" : ""
      } ${isOverdue ? "border-red-200 bg-red-50" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            checked={task.completed}
            onChange={(e) => onToggleComplete(task.Id, e.target.checked)}
            className="mt-0.5"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </h3>
              <Badge variant={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className={`text-sm mb-2 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                  Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                </span>
              </div>
              
              {task.cropId && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Sprout" className="w-3 h-3" />
                  <span>Crop Task</span>
                </div>
              )}
              
              {task.completed && task.completedAt && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="CheckCircle" className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">
                    Completed {format(new Date(task.completedAt), "MMM dd")}
                  </span>
                </div>
              )}
</div>

            {/* Internal/External Tag */}
            {task.internalExternal && (
              <Badge 
                variant={task.internalExternal === 'internal' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {task.internalExternal}
              </Badge>
            )}

            {/* Subtasks Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="flex items-center gap-1 text-xs"
            >
              <ApperIcon 
                name={showSubtasks ? "ChevronUp" : "ChevronDown"} 
                className="w-3 h-3" 
              />
              Subtasks ({subtasks.length})
            </Button>
</div>

          {/* Subtasks Section */}
          {showSubtasks && (
            <div className="mt-4 space-y-2">
              {subtasksLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  Loading subtasks...
                </div>
              ) : (
                <>
                  {/* Existing Subtasks */}
                  {subtasks.map((subtask) => (
                    <div key={subtask.Id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Checkbox
                        checked={subtask.completed}
                        onChange={(checked) => handleToggleSubtask(subtask.Id, checked)}
                      />
                      <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                        {subtask.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubtask(subtask.Id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}

                  {/* Add New Subtask */}
                  <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-200 rounded">
                    <ApperIcon name="Plus" className="w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Add new subtask..."
                      value={newSubtaskName}
                      onChange={(e) => setNewSubtaskName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={addingSubtask}
                      className="flex-1 border-0 bg-transparent text-sm focus:ring-0"
                    />
                    {newSubtaskName.trim() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddSubtask}
                        disabled={addingSubtask}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        {addingSubtask ? (
                          <ApperIcon name="Loader2" className="w-3 h-3 animate-spin" />
                        ) : (
                          <ApperIcon name="Check" className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {isOverdue && (
            <div className="flex items-center gap-1 mt-2">
              <ApperIcon name="AlertCircle" className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600 font-medium">Overdue</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.Id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;