import React from "react";
import Error from "@/components/ui/Error";
class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "internal_external_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data for UI compatibility
return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c,
        completedAt: task.completed_at_c,
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c,
        internalExternal: task.internal_external_c
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const taskId = parseInt(id);
      if (isNaN(taskId)) {
        throw new Error('Invalid task ID');
      }

      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "internal_external_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, taskId, params);
      
      if (!response.success || !response.data) {
        throw new Error('Task not found');
      }

      const task = response.data;
return {
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c,
        completedAt: task.completed_at_c,
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c,
        internalExternal: task.internal_external_c
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority || 'medium',
          completed_c: taskData.completed || false,
          completed_at_c: taskData.completedAt || null,
          farm_id_c: taskData.farmId ? parseInt(taskData.farmId) : null,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null,
          internal_external_c: taskData.internalExternal || null
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
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          throw new Error('Failed to create task');
        }
        
        if (successful.length > 0) {
          const task = successful[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name,
description: task.description_c,
            dueDate: task.due_date_c,
            priority: task.priority_c,
            completed: task.completed_c,
            completedAt: task.completed_at_c,
            farmId: task.farm_id_c?.Id || task.farm_id_c,
            cropId: task.crop_id_c?.Id || task.crop_id_c,
            internalExternal: task.internal_external_c
          };
        }
      }
      
      throw new Error('No task created');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const taskId = parseInt(id);
      if (isNaN(taskId)) {
        throw new Error('Invalid task ID');
      }

      const params = {
        records: [{
Id: taskId,
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: taskData.completed,
          completed_at_c: taskData.completedAt,
          farm_id_c: taskData.farmId ? parseInt(taskData.farmId) : null,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null,
          internal_external_c: taskData.internalExternal || null
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
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          throw new Error('Failed to update task');
        }
        
        if (successful.length > 0) {
const task = successful[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name,
            description: task.description_c,
            dueDate: task.due_date_c,
            priority: task.priority_c,
            completed: task.completed_c,
            completedAt: task.completed_at_c,
            farmId: task.farm_id_c?.Id || task.farm_id_c,
            cropId: task.crop_id_c?.Id || task.crop_id_c,
            internalExternal: task.internal_external_c
          };
        }
      }
      
      throw new Error('Task update failed');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const taskId = parseInt(id);
      if (isNaN(taskId)) {
        throw new Error('Invalid task ID');
      }

      const params = { 
        RecordIds: [taskId]
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
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          throw new Error('Failed to delete task');
        }
        
        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();