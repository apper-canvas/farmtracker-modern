import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Card } from "@/components/atoms/Card";
import { farmService } from "@/services/api/farmService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Checkbox from "@/components/atoms/Checkbox";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
const [sortBy, setSortBy] = useState('name');
  const [hoverRating, setHoverRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    status: 'active',
    description: '',
    valuation: '',
    farmTypes: [],
    rating: 0
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      console.error('Error loading farms:', err);
      setError('Failed to load farms');
      toast.error('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        const updatedFarm = await farmService.update(editingFarm.Id, formData);
        setFarms(prev => prev.map(farm => 
          farm.Id === editingFarm.Id ? updatedFarm : farm
        ));
        toast.success('Farm updated successfully');
      } else {
        const newFarm = await farmService.create(formData);
        setFarms(prev => [...prev, newFarm]);
        toast.success('Farm created successfully');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving farm:', err);
      toast.error('Failed to save farm');
    }
  };

  const handleDelete = async (farmId) => {
    if (!confirm('Are you sure you want to delete this farm?')) return;
    
    try {
      await farmService.delete(farmId);
      setFarms(prev => prev.filter(farm => farm.Id !== farmId));
      toast.success('Farm deleted successfully');
    } catch (err) {
      console.error('Error deleting farm:', err);
      toast.error('Failed to delete farm');
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
size: farm.size.toString(),
      status: farm.status,
      description: farm.description,
      valuation: farm.valuation ? farm.valuation.toString() : '',
      farmTypes: farm.farmTypes || [],
      rating: farm.rating || 0
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFarm(null);
    setFormData({
      name: '',
location: '',
      size: '',
      status: 'active',
      description: '',
      valuation: '',
      farmTypes: [],
      rating: 0
    });
  };

  const filteredAndSortedFarms = farms
    .filter(farm => {
      const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farm.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || farm.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farms</h1>
        <p className="text-gray-600">Manage your farm properties and locations</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Farms</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="planning">Planning</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="location">Sort by Location</option>
          </Select>
        </div>

        <Button onClick={() => setShowModal(true)}>
          <ApperIcon name="Plus" size={20} />
          Add Farm
        </Button>
      </div>

      {/* Farm Grid */}
      {filteredAndSortedFarms.length === 0 ? (
        <Empty
          title="No farms found"
          description={searchTerm || filterStatus !== 'all' ? 
            "No farms match your search criteria" : 
            "Get started by adding your first farm"
          }
          action={
            <Button onClick={() => setShowModal(true)}>
              <ApperIcon name="Plus" size={20} />
              Add Farm
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedFarms.map((farm) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {farm.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <ApperIcon name="MapPin" size={16} className="mr-1" />
                        {farm.location}
                      </p>
                    </div>
                    <Badge variant={farm.status === 'active' ? 'success' : 'secondary'}>
                      {farm.status}
                    </Badge>
                  </div>

<div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Maximize" size={16} className="mr-2" />
                        {farm.size} acres
                      </div>
                      {farm.valuation && (
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <ApperIcon name="DollarSign" size={14} className="mr-1" />
                          ${farm.valuation.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {farm.farmTypes && farm.farmTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {farm.farmTypes.slice(0, 3).map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                        {farm.farmTypes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{farm.farmTypes.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    {farm.rating > 0 && (
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <ApperIcon
                              key={star}
                              name="Star"
                              size={14}
                              className={`${
                                star <= farm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({farm.rating}/5)</span>
                      </div>
                    )}
                    {farm.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {farm.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(farm)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(farm.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                </h2>
                <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    required
                    placeholder="Enter farm name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                    required
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (acres) *
                  </label>
                  <Input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({...prev, size: e.target.value}))}
                    required
                    min="0"
                    step="0.1"
                    placeholder="Enter size in acres"
                  />
                </div>
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Valuation ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.valuation}
                    onChange={(e) => setFormData(prev => ({...prev, valuation: e.target.value}))}
                    placeholder="Enter farm valuation"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="planning">Planning</option>
                  </Select>
                </div>

                <div>
<label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Types *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Crop Production', 'Mixed', 'Organic', 'Livestock'].map((type) => (
                      <Checkbox
                        key={type}
                        name="farmTypes"
                        value={formData.farmTypes}
                        label={type}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          farmTypes: e.target.value
                        }))}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select all applicable farm types</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating of Farm
                  </label>
                  <div className="flex items-center space-x-1">
{[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, rating: star}))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <ApperIcon
                          name="Star"
                          size={24}
                          className={`transition-colors ${
                            star <= (hoverRating || formData.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-gray-600">
                      {formData.rating > 0 ? `${formData.rating}/5` : 'No rating'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Enter farm description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingFarm ? 'Update Farm' : 'Create Farm'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Farms;