import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { Card } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { farmerService } from '@/services/api/farmerService';

const Farmers = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
dateOfBirth: '',
    gender: '',
    address: '',
    farmName: '',
    farmLocation: '',
    farmSize: '',
    experience: '',
    primaryCrops: [],
    status: 'active'
  });

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await farmerService.getAll();
      setFarmers(data);
    } catch (err) {
      console.error('Error loading farmers:', err);
      setError('Failed to load farmers');
      toast.error('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        farmSize: parseFloat(formData.farmSize),
        experience: parseInt(formData.experience),
        primaryCrops: typeof formData.primaryCrops === 'string' 
          ? formData.primaryCrops.split(',').map(crop => crop.trim()).filter(crop => crop)
          : formData.primaryCrops
      };

      if (editingFarmer) {
        const updatedFarmer = await farmerService.update(editingFarmer.Id, submitData);
        setFarmers(prev => prev.map(farmer => 
          farmer.Id === editingFarmer.Id ? updatedFarmer : farmer
        ));
        toast.success('Farmer updated successfully');
      } else {
        const newFarmer = await farmerService.create(submitData);
        setFarmers(prev => [...prev, newFarmer]);
        toast.success('Farmer created successfully');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving farmer:', err);
      toast.error('Failed to save farmer');
    }
  };

  const handleDelete = async (farmerId) => {
    if (!confirm('Are you sure you want to delete this farmer?')) return;
    
    try {
      await farmerService.delete(farmerId);
      setFarmers(prev => prev.filter(farmer => farmer.Id !== farmerId));
      toast.success('Farmer deleted successfully');
    } catch (err) {
      console.error('Error deleting farmer:', err);
      toast.error('Failed to delete farmer');
    }
  };

  const handleEdit = (farmer) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone,
dateOfBirth: farmer.dateOfBirth ? farmer.dateOfBirth.split('T')[0] : '',
      gender: farmer.gender || '',
      address: farmer.address,
      farmName: farmer.farmName,
      farmLocation: farmer.farmLocation,
      farmSize: farmer.farmSize.toString(),
      experience: farmer.experience.toString(),
      primaryCrops: farmer.primaryCrops.join(', '),
      status: farmer.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFarmer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
dateOfBirth: '',
      gender: '',
      address: '',
      farmName: '',
      farmLocation: '',
      farmSize: '',
      experience: '',
      primaryCrops: [],
      status: 'active'
    });
  };

  const handleViewDetails = (farmerId) => {
    navigate(`/farmers/${farmerId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  const filteredAndSortedFarmers = farmers
    .filter(farmer => {
      const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farmer.primaryCrops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || farmer.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experience - a.experience;
        case 'farmSize':
          return b.farmSize - a.farmSize;
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarmers} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmers</h1>
        <p className="text-gray-600">Manage farmer profiles and information</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Farmers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="experience">Sort by Experience</option>
            <option value="farmSize">Sort by Farm Size</option>
          </Select>
        </div>

        <Button onClick={() => setShowModal(true)}>
          <ApperIcon name="Plus" size={20} />
          Add Farmer
        </Button>
      </div>

      {/* Farmer Grid */}
      {filteredAndSortedFarmers.length === 0 ? (
        <Empty
          title="No farmers found"
          description={searchTerm || filterStatus !== 'all' ? 
            "No farmers match your search criteria" : 
            "Get started by adding your first farmer"
          }
          action={
            <Button onClick={() => setShowModal(true)}>
              <ApperIcon name="Plus" size={20} />
              Add Farmer
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedFarmers.map((farmer) => (
            <motion.div
              key={farmer.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {farmer.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <ApperIcon name="Mail" size={16} className="mr-1" />
                        {farmer.email}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(farmer.status)}>
                      {farmer.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Tractor" size={16} className="mr-2" />
                      {farmer.farmName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="MapPin" size={16} className="mr-2" />
                      {farmer.farmLocation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Maximize" size={16} className="mr-2" />
                      {farmer.farmSize} acres
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Clock" size={16} className="mr-2" />
                      {farmer.experience} years experience
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {farmer.primaryCrops.slice(0, 3).map((crop, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {crop}
                        </Badge>
                      ))}
                      {farmer.primaryCrops.length > 3 && (
                        <Badge variant="secondary" size="sm">
                          +{farmer.primaryCrops.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(farmer.Id)}
                      className="flex-1"
                    >
                      <ApperIcon name="Eye" size={16} />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(farmer)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(farmer.Id)}
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
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
                </h2>
                <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      required
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({...prev, dateOfBirth: e.target.value}))}
                      placeholder="Select date of birth"
                    />
</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <Select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                    required
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.farmName}
                      onChange={(e) => setFormData(prev => ({...prev, farmName: e.target.value}))}
                      required
                      placeholder="Enter farm name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Location *
                    </label>
                    <Input
                      type="text"
                      value={formData.farmLocation}
                      onChange={(e) => setFormData(prev => ({...prev, farmLocation: e.target.value}))}
                      required
                      placeholder="Enter farm location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farm Size (acres) *
                    </label>
                    <Input
                      type="number"
                      value={formData.farmSize}
                      onChange={(e) => setFormData(prev => ({...prev, farmSize: e.target.value}))}
                      required
                      min="0"
                      step="0.1"
                      placeholder="Enter farm size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (years) *
                    </label>
                    <Input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({...prev, experience: e.target.value}))}
                      required
                      min="0"
                      placeholder="Years of experience"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Crops *
                  </label>
                  <Input
                    type="text"
                    value={formData.primaryCrops}
                    onChange={(e) => setFormData(prev => ({...prev, primaryCrops: e.target.value}))}
                    required
                    placeholder="Enter crops separated by commas (e.g., Wheat, Corn, Soybeans)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple crops with commas</p>
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
                    <option value="pending">Pending</option>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingFarmer ? 'Update Farmer' : 'Create Farmer'}
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

export default Farmers;