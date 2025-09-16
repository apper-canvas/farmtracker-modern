import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Layout from "@/components/organisms/Layout";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskItem from "@/components/molecules/TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [data, setData] = useState({
    crops: [],
    tasks: [],
    transactions: [],
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getCurrent()
      ]);

      setData({
        crops: cropsData,
        tasks: tasksData,
        transactions: transactionsData,
        weather: weatherData
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId, completed) => {
    try {
      const task = data.tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed,
        completedAt: completed ? new Date().toISOString() : null
      });

      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.Id === taskId ? updatedTask : t)
      }));

      toast.success(completed ? "Task completed!" : "Task marked as pending");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Task toggle error:", err);
    }
  };

  // Calculate statistics
  const totalCrops = data.crops.length;
  const pendingTasks = data.tasks.filter(task => !task.completed).length;
  const overdueTasks = data.tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = data.transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTasks = data.tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentActivities = [
    ...data.crops.slice(-3).map(crop => ({
      id: `crop-${crop.Id}`,
      type: "crop",
      message: `Added ${crop.name} crop`,
      date: crop.plantedDate,
      icon: "Sprout"
    })),
    ...data.tasks
      .filter(task => task.completed && task.completedAt)
      .slice(-3)
      .map(task => ({
        id: `task-${task.Id}`,
        type: "task",
        message: `Completed: ${task.title}`,
        date: task.completedAt,
        icon: "CheckCircle"
      }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) return <Layout title="Dashboard"><Loading /></Layout>;
  if (error) return <Layout title="Dashboard"><Error message={error} onRetry={loadDashboardData} /></Layout>;

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Crops"
            value={totalCrops}
            icon="Sprout"
            color="secondary"
            subtitle={`${data.crops.filter(c => c.status === "growing").length} currently growing`}
          />
          
          <StatCard
            title="Pending Tasks"
            value={pendingTasks}
            icon="CheckSquare"
            color="accent"
            subtitle={overdueTasks > 0 ? `${overdueTasks} overdue` : "All on schedule"}
          />
          
          <StatCard
            title="Monthly Income"
            value={`$${monthlyIncome.toLocaleString()}`}
            icon="TrendingUp"
            color="success"
            subtitle={`${monthlyTransactions.filter(t => t.type === "income").length} transactions`}
          />
          
          <StatCard
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toLocaleString()}`}
            icon="TrendingDown"
            color="primary"
            subtitle={`Net: $${(monthlyIncome - monthlyExpenses).toLocaleString()}`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Widget */}
          <div className="lg:col-span-1">
            <WeatherCard weather={data.weather} />
          </div>

          {/* Pending Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ApperIcon name="CheckSquare" className="w-5 h-5 text-accent-600" />
                    Upcoming Tasks
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTasks.length === 0 ? (
                  <Empty
                    title="No pending tasks"
                    description="All caught up! Consider adding new tasks for your farm operations."
                    icon="CheckCircle2"
                  />
                ) : (
                  <div className="space-y-3">
                    {recentTasks.map((task) => (
                      <TaskItem
                        key={task.Id}
                        task={task}
                        onToggleComplete={handleTaskToggle}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity and Crop Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Activity" className="w-5 h-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <Empty
                  title="No recent activity"
                  description="Start adding crops and completing tasks to see activity here."
                  icon="Activity"
                />
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <ApperIcon name={activity.icon} className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.date), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crop Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="BarChart3" className="w-5 h-5 text-secondary-600" />
                Crop Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.crops.length === 0 ? (
                <Empty
                  title="No crops planted"
                  description="Add your first crop to start tracking your farm's progress."
                  icon="Sprout"
                />
              ) : (
                <div className="space-y-4">
                  {["planted", "growing", "flowering", "ready", "harvested"].map((status) => {
                    const count = data.crops.filter(crop => crop.status === status).length;
                    if (count === 0) return null;
                    
                    const statusColors = {
                      planted: "bg-blue-500",
                      growing: "bg-green-500",
                      flowering: "bg-yellow-500",
                      ready: "bg-orange-500",
                      harvested: "bg-gray-500"
                    };
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{count} crop{count !== 1 ? "s" : ""}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;