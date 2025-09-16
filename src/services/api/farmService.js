import mockFarms from '@/services/mockData/farms.json';

class FarmService {
  constructor() {
    this.farms = [...mockFarms];
    this.nextId = Math.max(...this.farms.map(f => f.Id), 0) + 1;
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.farms];
  }

  async getById(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const farmId = parseInt(id);
    if (isNaN(farmId)) {
      throw new Error('Invalid farm ID');
    }

    const farm = this.farms.find(f => f.Id === farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    return { ...farm };
  }

  async create(farmData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const newFarm = {
      Id: this.nextId++,
      name: farmData.name,
      location: farmData.location,
      size: parseFloat(farmData.size),
      status: farmData.status || 'active',
      description: farmData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.farms.push(newFarm);
    return { ...newFarm };
  }

  async update(id, farmData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const farmId = parseInt(id);
    if (isNaN(farmId)) {
      throw new Error('Invalid farm ID');
    }

    const index = this.farms.findIndex(f => f.Id === farmId);
    if (index === -1) {
      throw new Error('Farm not found');
    }

    const updatedFarm = {
      ...this.farms[index],
      name: farmData.name,
      location: farmData.location,
      size: parseFloat(farmData.size),
      status: farmData.status,
      description: farmData.description || '',
      updatedAt: new Date().toISOString()
    };

    this.farms[index] = updatedFarm;
    return { ...updatedFarm };
  }

  async delete(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const farmId = parseInt(id);
    if (isNaN(farmId)) {
      throw new Error('Invalid farm ID');
    }

    const index = this.farms.findIndex(f => f.Id === farmId);
    if (index === -1) {
      throw new Error('Farm not found');
    }

    this.farms.splice(index, 1);
    return { success: true };
  }
}

export const farmService = new FarmService();