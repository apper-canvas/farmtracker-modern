class CropService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data for UI compatibility
      return response.data.map(crop => ({
        Id: crop.Id,
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        area: crop.area_c,
        status: crop.status_c,
        expectedHarvest: crop.expected_harvest_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c
      }));
    } catch (error) {
      console.error("Error fetching crops:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const cropId = parseInt(id);
      if (isNaN(cropId)) {
        throw new Error('Invalid crop ID');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, cropId, params);
      
      if (!response.success || !response.data) {
        throw new Error('Crop not found');
      }

      const crop = response.data;
      return {
        Id: crop.Id,
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        area: crop.area_c,
        status: crop.status_c,
        expectedHarvest: crop.expected_harvest_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c
      };
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error);
      throw error;
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [{
          Name: cropData.name,
          name_c: cropData.name,
          variety_c: cropData.variety,
          planted_date_c: cropData.plantedDate,
          area_c: parseFloat(cropData.area),
          status_c: cropData.status || 'planted',
          expected_harvest_c: cropData.expectedHarvest,
          farm_id_c: parseInt(cropData.farmId)
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
          console.error(`Failed to create ${failed.length} crops:`, failed);
          throw new Error('Failed to create crop');
        }
        
        if (successful.length > 0) {
          const crop = successful[0].data;
          return {
            Id: crop.Id,
            name: crop.name_c || crop.Name,
            variety: crop.variety_c,
            plantedDate: crop.planted_date_c,
            area: crop.area_c,
            status: crop.status_c,
            expectedHarvest: crop.expected_harvest_c,
            farmId: crop.farm_id_c?.Id || crop.farm_id_c
          };
        }
      }
      
      throw new Error('No crop created');
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const cropId = parseInt(id);
      if (isNaN(cropId)) {
        throw new Error('Invalid crop ID');
      }

      const params = {
        records: [{
          Id: cropId,
          Name: cropData.name,
          name_c: cropData.name,
          variety_c: cropData.variety,
          planted_date_c: cropData.plantedDate,
          area_c: parseFloat(cropData.area),
          status_c: cropData.status,
          expected_harvest_c: cropData.expectedHarvest,
          farm_id_c: parseInt(cropData.farmId)
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
          console.error(`Failed to update ${failed.length} crops:`, failed);
          throw new Error('Failed to update crop');
        }
        
        if (successful.length > 0) {
          const crop = successful[0].data;
          return {
            Id: crop.Id,
            name: crop.name_c || crop.Name,
            variety: crop.variety_c,
            plantedDate: crop.planted_date_c,
            area: crop.area_c,
            status: crop.status_c,
            expectedHarvest: crop.expected_harvest_c,
            farmId: crop.farm_id_c?.Id || crop.farm_id_c
          };
        }
      }
      
      throw new Error('Crop update failed');
    } catch (error) {
      console.error("Error updating crop:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const cropId = parseInt(id);
      if (isNaN(cropId)) {
        throw new Error('Invalid crop ID');
      }

      const params = { 
        RecordIds: [cropId]
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
          console.error(`Failed to delete ${failed.length} crops:`, failed);
          throw new Error('Failed to delete crop');
        }
        
        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
}

export const cropService = new CropService();