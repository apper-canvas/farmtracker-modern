import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { farmerService } from '@/services/api/farmerService';

const FarmerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFarmerDetails();
  }, [id]);

  const loadFarmerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const farmerData = await farmerService.getById(parseInt(id));
      if (!farmerData) {
        setError('Farmer not found');
        return;
      }
      setFarmer(farmerData);
    } catch (err) {
      console.error('Error loading farmer details:', err);
      setError('Failed to load farmer details');
      toast.error('Failed to load farmer details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/farmers');
  };

  const handleEdit = () => {
    navigate(`/farmers/edit/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!farmer) return <Empty message="Farmer not found" />;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              <span>Back to Farmers</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{farmer.name}</h1>
              <p className="text-gray-600 mt-1">Farmer ID: {farmer.Id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={getStatusColor(farmer.status)} size="lg">
              {farmer.status}
            </Badge>
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <ApperIcon name="Edit" size={16} />
              <span>Edit Farmer</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="User" className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{farmer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{farmer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900">{farmer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{new Date(farmer.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <p className="text-gray-900">{farmer.address}</p>
                </div>
              </div>
            </Card>

            {/* Farm Information */}
            <Card className="p-6 mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Tractor" className="w-6 h-6 text-secondary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Farm Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Farm Name</label>
                  <p className="text-gray-900 font-medium">{farmer.farmName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Farm Size</label>
                  <p className="text-gray-900">{farmer.farmSize} acres</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Primary Crops</label>
                  <div className="flex flex-wrap gap-2">
                    {farmer.primaryCrops.map((crop, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Farming Experience</label>
                  <p className="text-gray-900">{farmer.experience} years</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Farm Location</label>
                  <p className="text-gray-900">{farmer.farmLocation}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Farms</span>
                  <span className="font-semibold text-gray-900">{farmer.stats?.totalFarms || 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Crops</span>
                  <span className="font-semibold text-gray-900">{farmer.stats?.activeCrops || farmer.primaryCrops.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Tasks</span>
                  <span className="font-semibold text-gray-900">{farmer.stats?.pendingTasks || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(farmer.memberSince).getFullYear()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/farms?farmerId=${farmer.Id}`)}
                >
                  <ApperIcon name="Tractor" size={16} className="mr-2" />
                  View Farms
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/tasks?farmerId=${farmer.Id}`)}
                >
                  <ApperIcon name="CheckSquare" size={16} className="mr-2" />
                  View Tasks
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/crops?farmerId=${farmer.Id}`)}
                >
                  <ApperIcon name="Sprout" size={16} className="mr-2" />
                  View Crops
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `mailto:${farmer.email}`}
                >
                  <ApperIcon name="Mail" size={16} className="mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `tel:${farmer.phone}`}
                >
                  <ApperIcon name="Phone" size={16} className="mr-2" />
                  Call Farmer
                </Button>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Mail" size={16} className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{farmer.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Phone" size={16} className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{farmer.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ApperIcon name="MapPin" size={16} className="text-gray-400 mt-0.5" />
                  <span className="text-gray-600 text-sm">{farmer.address}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerDetails;