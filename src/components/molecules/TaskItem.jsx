import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
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
            
            {isOverdue && (
              <div className="flex items-center gap-1 mt-2">
                <ApperIcon name="AlertCircle" className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600 font-medium">Overdue</span>
              </div>
            )}
          </div>
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