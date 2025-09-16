import cropData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.crops];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  }

  async create(cropData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = this.crops.length > 0 ? Math.max(...this.crops.map(c => c.Id)) + 1 : 1;
    const newCrop = {
      Id: newId,
      ...cropData,
      createdAt: new Date().toISOString()
    };
    
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops[index] = {
      ...this.crops[index],
      ...cropData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.crops[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops.splice(index, 1);
    return true;
  }
}

export const cropService = new CropService();