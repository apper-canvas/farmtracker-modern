import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import TaskForm from "@/components/organisms/TaskForm";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import TaskItem from "@/components/molecules/TaskItem";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Tasks loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = (savedTask) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => task.Id === editingTask.Id ? savedTask : task));
    } else {
      setTasks(prev => [...prev, savedTask]);
    }
    
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Delete task error:", err);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed,
        completedAt: completed ? new Date().toISOString() : null
      });

      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(completed ? "Task completed!" : "Task marked as pending");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Task toggle error:", err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      case "overdue":
        return !task.completed && new Date(task.dueDate) < new Date();
      case "high":
        return task.priority === "high";
      default:
        return true;
    }
  });

  // Sort tasks (pending first, then by due date)
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
    { value: "high", label: "High Priority" }
  ];

if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
<div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Keep track of your daily farm operations and activities</p>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add New Task
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TaskForm
              task={editingTask}
              onSave={handleSaveTask}
              onCancel={handleCancelForm}
            />
          </motion.div>
        )}

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-accent-600" />
                Your Tasks ({filteredTasks.length})
              </CardTitle>
              
              <div className="flex items-center gap-3">
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="min-w-[150px]"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedTasks.length === 0 ? (
              <Empty
                title={filter === "all" ? "No tasks created yet" : `No ${filter} tasks`}
                description={
                  filter === "all"
                    ? "Start by adding your first task to organize your farm operations."
                    : `There are currently no ${filter} tasks.`
                }
                icon="CheckSquare"
                actionLabel={filter === "all" ? "Add First Task" : undefined}
                onAction={filter === "all" ? () => setShowForm(true) : undefined}
              />
            ) : (
              <div className="space-y-4">
                {sortedTasks.map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {tasks.length}
                </div>
                <div className="text-sm text-blue-600">Total Tasks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">
                  {tasks.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">
                  {tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length}
                </div>
                <div className="text-sm text-red-600">Overdue</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
</div>
  );
};

export default Tasks;