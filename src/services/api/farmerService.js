class FarmerService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farmer_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "farm_name_c"}},
          {"field": {"Name": "farm_location_c"}},
          {"field": {"Name": "farm_size_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "primary_crops_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "member_since_c"}},
          {"field": {"Name": "total_farms_c"}},
          {"field": {"Name": "active_crops_c"}},
          {"field": {"Name": "pending_tasks_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data for UI compatibility
      return response.data.map(farmer => ({
        Id: farmer.Id,
        name: farmer.name_c || farmer.Name,
        email: farmer.email_c,
        phone: farmer.phone_c,
        dateOfBirth: farmer.date_of_birth_c,
        gender: farmer.gender_c,
        address: farmer.address_c,
        farmName: farmer.farm_name_c,
        farmLocation: farmer.farm_location_c,
        farmSize: farmer.farm_size_c,
        experience: farmer.experience_c,
        primaryCrops: farmer.primary_crops_c ? farmer.primary_crops_c.split(',').map(c => c.trim()) : [],
        status: farmer.status_c,
        memberSince: farmer.member_since_c,
        stats: {
          totalFarms: farmer.total_farms_c || 1,
          activeCrops: farmer.active_crops_c || 0,
          pendingTasks: farmer.pending_tasks_c || 0
        }
      }));
    } catch (error) {
      console.error("Error fetching farmers:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const farmerId = parseInt(id);
      if (isNaN(farmerId)) {
        throw new Error('Invalid farmer ID');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "farm_name_c"}},
          {"field": {"Name": "farm_location_c"}},
          {"field": {"Name": "farm_size_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "primary_crops_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "member_since_c"}},
          {"field": {"Name": "total_farms_c"}},
          {"field": {"Name": "active_crops_c"}},
          {"field": {"Name": "pending_tasks_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, farmerId, params);
      
      if (!response.success || !response.data) {
        return null;
      }

      const farmer = response.data;
      return {
        Id: farmer.Id,
        name: farmer.name_c || farmer.Name,
        email: farmer.email_c,
        phone: farmer.phone_c,
        dateOfBirth: farmer.date_of_birth_c,
        gender: farmer.gender_c,
        address: farmer.address_c,
        farmName: farmer.farm_name_c,
        farmLocation: farmer.farm_location_c,
        farmSize: farmer.farm_size_c,
        experience: farmer.experience_c,
        primaryCrops: farmer.primary_crops_c ? farmer.primary_crops_c.split(',').map(c => c.trim()) : [],
        status: farmer.status_c,
        memberSince: farmer.member_since_c,
        stats: {
          totalFarms: farmer.total_farms_c || 1,
          activeCrops: farmer.active_crops_c || 0,
          pendingTasks: farmer.pending_tasks_c || 0
        }
      };
    } catch (error) {
      console.error(`Error fetching farmer ${id}:`, error);
      throw error;
    }
  }

  async create(farmerData) {
    try {
      const params = {
        records: [{
          Name: farmerData.name,
          name_c: farmerData.name,
          email_c: farmerData.email,
          phone_c: farmerData.phone,
          date_of_birth_c: farmerData.dateOfBirth,
          gender_c: farmerData.gender,
          address_c: farmerData.address,
          farm_name_c: farmerData.farmName,
          farm_location_c: farmerData.farmLocation,
          farm_size_c: parseFloat(farmerData.farmSize),
          experience_c: parseInt(farmerData.experience),
          primary_crops_c: Array.isArray(farmerData.primaryCrops) 
            ? farmerData.primaryCrops.join(', ') 
            : farmerData.primaryCrops,
          status_c: farmerData.status || 'active',
          member_since_c: new Date().toISOString(),
          total_farms_c: 1,
          active_crops_c: Array.isArray(farmerData.primaryCrops) ? farmerData.primaryCrops.length : 0,
          pending_tasks_c: 0
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farmers:`, failed);
          throw new Error('Failed to create farmer');
        }
        
        if (successful.length > 0) {
          const farmer = successful[0].data;
          return {
            Id: farmer.Id,
            name: farmer.name_c || farmer.Name,
            email: farmer.email_c,
            phone: farmer.phone_c,
            dateOfBirth: farmer.date_of_birth_c,
            gender: farmer.gender_c,
            address: farmer.address_c,
            farmName: farmer.farm_name_c,
            farmLocation: farmer.farm_location_c,
            farmSize: farmer.farm_size_c,
            experience: farmer.experience_c,
            primaryCrops: farmer.primary_crops_c ? farmer.primary_crops_c.split(',').map(c => c.trim()) : [],
            status: farmer.status_c,
            memberSince: farmer.member_since_c,
            stats: {
              totalFarms: farmer.total_farms_c || 1,
              activeCrops: farmer.active_crops_c || 0,
              pendingTasks: farmer.pending_tasks_c || 0
            }
          };
        }
      }
      
      throw new Error('No farmer created');
    } catch (error) {
      console.error("Error creating farmer:", error);
      throw error;
    }
  }

  async update(id, farmerData) {
    try {
      const farmerId = parseInt(id);
      if (isNaN(farmerId)) {
        throw new Error('Invalid farmer ID');
      }

      const params = {
        records: [{
          Id: farmerId,
          Name: farmerData.name,
          name_c: farmerData.name,
          email_c: farmerData.email,
          phone_c: farmerData.phone,
          date_of_birth_c: farmerData.dateOfBirth,
          gender_c: farmerData.gender,
          address_c: farmerData.address,
          farm_name_c: farmerData.farmName,
          farm_location_c: farmerData.farmLocation,
          farm_size_c: parseFloat(farmerData.farmSize),
          experience_c: parseInt(farmerData.experience),
          primary_crops_c: Array.isArray(farmerData.primaryCrops) 
            ? farmerData.primaryCrops.join(', ') 
            : farmerData.primaryCrops,
          status_c: farmerData.status,
          active_crops_c: Array.isArray(farmerData.primaryCrops) ? farmerData.primaryCrops.length : 0
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farmers:`, failed);
          throw new Error('Failed to update farmer');
        }
        
        if (successful.length > 0) {
          const farmer = successful[0].data;
          return {
            Id: farmer.Id,
            name: farmer.name_c || farmer.Name,
            email: farmer.email_c,
            phone: farmer.phone_c,
            dateOfBirth: farmer.date_of_birth_c,
            gender: farmer.gender_c,
            address: farmer.address_c,
            farmName: farmer.farm_name_c,
            farmLocation: farmer.farm_location_c,
            farmSize: farmer.farm_size_c,
            experience: farmer.experience_c,
            primaryCrops: farmer.primary_crops_c ? farmer.primary_crops_c.split(',').map(c => c.trim()) : [],
            status: farmer.status_c,
            memberSince: farmer.member_since_c,
            stats: {
              totalFarms: farmer.total_farms_c || 1,
              activeCrops: farmer.active_crops_c || 0,
              pendingTasks: farmer.pending_tasks_c || 0
            }
          };
        }
      }
      
      throw new Error('Farmer update failed');
    } catch (error) {
      console.error("Error updating farmer:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const farmerId = parseInt(id);
      if (isNaN(farmerId)) {
        throw new Error('Invalid farmer ID');
      }

      const params = { 
        RecordIds: [farmerId]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farmers:`, failed);
          throw new Error('Failed to delete farmer');
        }
        
        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting farmer:", error);
      throw error;
    }
  }

  async search(query) {
    try {
      const searchTerm = query.toLowerCase();
      const allFarmers = await this.getAll();
      
      return allFarmers.filter(farmer =>
        farmer.name.toLowerCase().includes(searchTerm) ||
        farmer.email.toLowerCase().includes(searchTerm) ||
        farmer.farmName.toLowerCase().includes(searchTerm) ||
        farmer.primaryCrops.some(crop => crop.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching farmers:", error);
      throw error;
    }
  }
}

export const farmerService = new FarmerService();