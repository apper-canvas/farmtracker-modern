import farmersData from '@/services/mockData/farmers.json';

let farmers = [...farmersData];

export const farmerService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...farmers];
  },

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const farmer = farmers.find(f => f.Id === parseInt(id));
    return farmer ? { ...farmer } : null;
  },

  async create(farmerData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newFarmer = {
      ...farmerData,
      Id: Math.max(...farmers.map(f => f.Id), 0) + 1,
      memberSince: new Date().toISOString(),
      status: 'active',
      stats: {
        totalFarms: 1,
        activeCrops: farmerData.primaryCrops?.length || 0,
        pendingTasks: 0
      }
    };
    
    farmers.push(newFarmer);
    return { ...newFarmer };
  },

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = farmers.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Farmer not found');
    }
    
    farmers[index] = { ...farmers[index], ...updateData };
    return { ...farmers[index] };
  },

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = farmers.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Farmer not found');
    }
    
    farmers.splice(index, 1);
    return true;
  },

  async search(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const searchTerm = query.toLowerCase();
    return farmers.filter(farmer =>
      farmer.name.toLowerCase().includes(searchTerm) ||
      farmer.email.toLowerCase().includes(searchTerm) ||
      farmer.farmName.toLowerCase().includes(searchTerm) ||
      farmer.primaryCrops.some(crop => crop.toLowerCase().includes(searchTerm))
    );
  }
};