import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";

const CropForm = ({ crop, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    plantedDate: "",
    area: "",
    status: "planted",
    expectedHarvest: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "planted", label: "Planted" },
    { value: "growing", label: "Growing" },
    { value: "flowering", label: "Flowering" },
    { value: "ready", label: "Ready to Harvest" },
    { value: "harvested", label: "Harvested" }
  ];

  useEffect(() => {
    if (crop) {
      setFormData({
        name: crop.name || "",
        variety: crop.variety || "",
        plantedDate: crop.plantedDate ? format(new Date(crop.plantedDate), "yyyy-MM-dd") : "",
        area: crop.area?.toString() || "",
        status: crop.status || "planted",
        expectedHarvest: crop.expectedHarvest ? format(new Date(crop.expectedHarvest), "yyyy-MM-dd") : ""
      });
    }
  }, [crop]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Crop name is required";
    }
    
    if (!formData.plantedDate) {
      newErrors.plantedDate = "Planted date is required";
    }
    
    if (!formData.area || formData.area <= 0) {
      newErrors.area = "Area must be greater than 0";
    }
    
    if (formData.expectedHarvest && formData.plantedDate) {
      const plantedDate = new Date(formData.plantedDate);
      const expectedHarvest = new Date(formData.expectedHarvest);
      if (expectedHarvest <= plantedDate) {
        newErrors.expectedHarvest = "Expected harvest date must be after planted date";
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
      const cropData = {
        ...formData,
        area: parseFloat(formData.area),
        plantedDate: new Date(formData.plantedDate).toISOString(),
        expectedHarvest: formData.expectedHarvest ? new Date(formData.expectedHarvest).toISOString() : null,
        farmId: "1" // Default farm ID
      };

      let savedCrop;
      if (crop) {
        savedCrop = await cropService.update(crop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        savedCrop = await cropService.create(cropData);
        toast.success("Crop added successfully!");
      }
      
      onSave(savedCrop);
    } catch (error) {
      toast.error("Failed to save crop: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Sprout" className="w-5 h-5 text-secondary-600" />
          {crop ? "Edit Crop" : "Add New Crop"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Crop Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g., Corn, Wheat, Tomatoes"
            />
            
            <Input
              label="Variety"
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              placeholder="e.g., Sweet Corn, Winter Wheat"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Planted Date"
              name="plantedDate"
              value={formData.plantedDate}
              onChange={handleChange}
              error={errors.plantedDate}
            />
            
            <Input
              type="date"
              label="Expected Harvest Date"
              name="expectedHarvest"
              value={formData.expectedHarvest}
              onChange={handleChange}
              error={errors.expectedHarvest}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Area (acres)"
              name="area"
              value={formData.area}
              onChange={handleChange}
              error={errors.area}
              min="0"
              step="0.1"
              placeholder="0.0"
            />
            
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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
              {crop ? "Update Crop" : "Add Crop"}
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

export default CropForm;