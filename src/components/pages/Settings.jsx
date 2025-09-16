import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [farmSettings, setFarmSettings] = useState({
    name: "Green Valley Farm",
    location: "Iowa, USA",
    size: "250",
    unit: "acres",
    timezone: "America/Chicago",
    currency: "USD"
  });

  const [notifications, setNotifications] = useState({
    taskReminders: true,
    weatherAlerts: true,
    harvestReminders: true,
    expenseTracking: true
  });

  const [preferences, setPreferences] = useState({
    temperatureUnit: "fahrenheit",
    dateFormat: "MM/dd/yyyy",
    defaultCropView: "grid",
    autoSave: true
  });

  const handleFarmSettingsChange = (e) => {
    const { name, value } = e.target;
    setFarmSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (name, checked) => {
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveFarmSettings = (e) => {
    e.preventDefault();
    toast.success("Farm settings updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated!");
  };

  const handleSavePreferences = () => {
    toast.success("Application preferences updated!");
  };

  const timezones = [
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" }
  ];

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your farm profile and application preferences</p>
        </div>

        {/* Farm Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Home" className="w-5 h-5 text-primary-600" />
                Farm Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveFarmSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Farm Name"
                    name="name"
                    value={farmSettings.name}
                    onChange={handleFarmSettingsChange}
                    placeholder="Enter your farm name"
                  />
                  
                  <Input
                    label="Location"
                    name="location"
                    value={farmSettings.location}
                    onChange={handleFarmSettingsChange}
                    placeholder="City, State/Country"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    label="Farm Size"
                    name="size"
                    value={farmSettings.size}
                    onChange={handleFarmSettingsChange}
                    min="0"
                    step="0.1"
                  />
                  
                  <Select
                    label="Unit"
                    name="unit"
                    value={farmSettings.unit}
                    onChange={handleFarmSettingsChange}
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="square_feet">Square Feet</option>
                    <option value="square_meters">Square Meters</option>
                  </Select>

                  <Select
                    label="Timezone"
                    name="timezone"
                    value={farmSettings.timezone}
                    onChange={handleFarmSettingsChange}
                  >
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save Farm Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Bell" className="w-5 h-5 text-accent-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "taskReminders", label: "Task Reminders", description: "Get notified about upcoming and overdue tasks" },
                  { key: "weatherAlerts", label: "Weather Alerts", description: "Receive alerts for weather conditions affecting your crops" },
                  { key: "harvestReminders", label: "Harvest Reminders", description: "Get reminded when crops are ready to harvest" },
                  { key: "expenseTracking", label: "Expense Notifications", description: "Get notified about expense trends and budgets" }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveNotifications}>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Settings" className="w-5 h-5 text-gray-600" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Temperature Unit"
                    name="temperatureUnit"
                    value={preferences.temperatureUnit}
                    onChange={handlePreferenceChange}
                  >
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                    <option value="celsius">Celsius (°C)</option>
                  </Select>

                  <Select
                    label="Date Format"
                    name="dateFormat"
                    value={preferences.dateFormat}
                    onChange={handlePreferenceChange}
                  >
                    <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                    <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                    <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Default Crop View"
                    name="defaultCropView"
                    value={preferences.defaultCropView}
                    onChange={handlePreferenceChange}
                  >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                    <option value="table">Table View</option>
                  </Select>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Data Options
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="autoSave"
                        checked={preferences.autoSave}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">Auto-save form drafts</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSavePreferences}>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Database" className="w-5 h-5 text-blue-600" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Export Data</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Download your farm data as a backup or for analysis
                    </p>
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900 mb-2">Reset Data</h4>
                    <p className="text-sm text-amber-700 mb-3">
                      Clear all data and start fresh (cannot be undone)
                    </p>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                      Reset All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;