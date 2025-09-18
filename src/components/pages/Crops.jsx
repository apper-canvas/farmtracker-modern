import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import CropForm from "@/components/organisms/CropForm";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await cropService.getAll();
      setCrops(data);
    } catch (err) {
      setError("Failed to load crops. Please try again.");
      console.error("Crops loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCrop = (savedCrop) => {
    if (editingCrop) {
      setCrops(prev => prev.map(crop => crop.Id === editingCrop.Id ? savedCrop : crop));
    } else {
      setCrops(prev => [...prev, savedCrop]);
    }
    
    setShowForm(false);
    setEditingCrop(null);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleDeleteCrop = async (cropId) => {
    if (!confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
      return;
    }

    try {
      await cropService.delete(cropId);
      setCrops(prev => prev.filter(crop => crop.Id !== cropId));
      toast.success("Crop deleted successfully");
    } catch (err) {
      toast.error("Failed to delete crop");
      console.error("Delete crop error:", err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCrop(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planted": return "primary";
      case "growing": return "success";
      case "flowering": return "warning";
      case "ready": return "accent";
      case "harvested": return "default";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "planted": return "Seed";
      case "growing": return "Sprout";
      case "flowering": return "Flower";
      case "ready": return "Apple";
      case "harvested": return "Package";
      default: return "Sprout";
    }
  };

if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

  return (
<div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crop Management</h1>
            <p className="text-gray-600">Track and manage your crop plantings and harvests</p>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add New Crop
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CropForm
              crop={editingCrop}
              onSave={handleSaveCrop}
              onCancel={handleCancelForm}
            />
          </motion.div>
        )}

        {/* Crops List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Sprout" className="w-5 h-5 text-secondary-600" />
              Your Crops ({crops.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <Empty
                title="No crops planted yet"
                description="Start by adding your first crop to track your farm's progress and harvests."
                icon="Sprout"
                actionLabel="Add First Crop"
                onAction={() => setShowForm(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
<tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Crop</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farm</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Planted Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Expected Harvest</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crops.map((crop, index) => (
                      <motion.tr
                        key={crop.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                              <ApperIcon name={getStatusIcon(crop.status)} className="w-5 h-5 text-secondary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{crop.name}</p>
                              {crop.variety && (
                                <p className="text-sm text-gray-500">{crop.variety}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4">
                          <Badge variant={getStatusColor(crop.status)}>
                            <span className="capitalize">{crop.status}</span>
                          </Badge>
                        </td>
                        
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{crop.area} acres</span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <span className="text-gray-700">
                            {format(new Date(crop.plantedDate), "MMM dd, yyyy")}
                          </span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <span className="text-gray-700">
                            {crop.expectedHarvest 
                              ? format(new Date(crop.expectedHarvest), "MMM dd, yyyy")
                              : "Not set"
                            }
                          </span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCrop(crop)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
                              title="Edit crop"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCrop(crop.Id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                              title="Delete crop"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
</div>
  );
};

export default Crops;