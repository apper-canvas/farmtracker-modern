class FarmService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farm_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "valuation_c"}},
          {"field": {"Name": "farm_types_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data for UI compatibility
      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        location: farm.location_c,
        size: farm.size_c,
        status: farm.status_c,
        description: farm.description_c,
        valuation: farm.valuation_c,
        farmTypes: farm.farm_types_c ? farm.farm_types_c.split(',') : [],
        rating: farm.rating_c,
        createdAt: farm.created_at_c,
        updatedAt: farm.updated_at_c
      }));
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const farmId = parseInt(id);
      if (isNaN(farmId)) {
        throw new Error('Invalid farm ID');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "valuation_c"}},
          {"field": {"Name": "farm_types_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, farmId, params);
      
      if (!response.success || !response.data) {
        throw new Error('Farm not found');
      }

      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        location: farm.location_c,
        size: farm.size_c,
        status: farm.status_c,
        description: farm.description_c,
        valuation: farm.valuation_c,
        farmTypes: farm.farm_types_c ? farm.farm_types_c.split(',') : [],
        rating: farm.rating_c,
        createdAt: farm.created_at_c,
        updatedAt: farm.updated_at_c
      };
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error);
      throw error;
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [{
          Name: farmData.name,
          name_c: farmData.name,
          location_c: farmData.location,
          size_c: parseFloat(farmData.size),
          status_c: farmData.status || 'active',
          description_c: farmData.description || '',
          valuation_c: farmData.valuation ? parseFloat(farmData.valuation) : null,
          farm_types_c: Array.isArray(farmData.farmTypes) ? farmData.farmTypes.join(',') : '',
          rating_c: farmData.rating || 0,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} farms:`, failed);
          throw new Error('Failed to create farm');
        }
        
        if (successful.length > 0) {
          const farm = successful[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c || farm.Name,
            location: farm.location_c,
            size: farm.size_c,
            status: farm.status_c,
            description: farm.description_c,
            valuation: farm.valuation_c,
            farmTypes: farm.farm_types_c ? farm.farm_types_c.split(',') : [],
            rating: farm.rating_c,
            createdAt: farm.created_at_c,
            updatedAt: farm.updated_at_c
          };
        }
      }
      
      throw new Error('No farm created');
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      const farmId = parseInt(id);
      if (isNaN(farmId)) {
        throw new Error('Invalid farm ID');
      }

      const params = {
        records: [{
          Id: farmId,
          Name: farmData.name,
          name_c: farmData.name,
          location_c: farmData.location,
          size_c: parseFloat(farmData.size),
          status_c: farmData.status,
          description_c: farmData.description || '',
          valuation_c: farmData.valuation ? parseFloat(farmData.valuation) : null,
          farm_types_c: Array.isArray(farmData.farmTypes) ? farmData.farmTypes.join(',') : '',
          rating_c: farmData.rating !== undefined ? farmData.rating : 0,
          updated_at_c: new Date().toISOString()
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
          console.error(`Failed to update ${failed.length} farms:`, failed);
          throw new Error('Failed to update farm');
        }
        
        if (successful.length > 0) {
          const farm = successful[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c || farm.Name,
            location: farm.location_c,
            size: farm.size_c,
            status: farm.status_c,
            description: farm.description_c,
            valuation: farm.valuation_c,
            farmTypes: farm.farm_types_c ? farm.farm_types_c.split(',') : [],
            rating: farm.rating_c,
            createdAt: farm.created_at_c,
            updatedAt: farm.updated_at_c
          };
        }
      }
      
      throw new Error('Farm update failed');
    } catch (error) {
      console.error("Error updating farm:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const farmId = parseInt(id);
      if (isNaN(farmId)) {
        throw new Error('Invalid farm ID');
      }

      const params = { 
        RecordIds: [farmId]
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
          console.error(`Failed to delete ${failed.length} farms:`, failed);
          throw new Error('Failed to delete farm');
        }
        
        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw error;
    }
  }
}

export const farmService = new FarmService();