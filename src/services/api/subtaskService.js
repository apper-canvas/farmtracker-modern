class SubtaskService {
  constructor() {
    this.tableName = 'subtask_c';
  }

  // Get all subtasks
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "completed_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(subtask => ({
        Id: subtask.Id,
        name: subtask.name_c || subtask.Name,
        taskId: subtask.task_id_c?.Id || subtask.task_id_c,
        completed: subtask.completed_c || false
      }));
    } catch (error) {
      console.error("Error fetching subtasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Get subtasks by task ID
  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "completed_c"}}
        ],
        where: [
          {"FieldName": "task_id_c", "Operator": "EqualTo", "Values": [parseInt(taskId)]}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(subtask => ({
        Id: subtask.Id,
        name: subtask.name_c || subtask.Name,
        taskId: subtask.task_id_c?.Id || subtask.task_id_c,
        completed: subtask.completed_c || false
      }));
    } catch (error) {
      console.error("Error fetching subtasks for task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Create new subtask
  async create(subtaskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: subtaskData.name,
          name_c: subtaskData.name,
          task_id_c: parseInt(subtaskData.taskId),
          completed_c: false
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const subtask = successful[0].data;
          return {
            Id: subtask.Id,
            name: subtask.name_c || subtask.Name,
            taskId: subtask.task_id_c?.Id || subtask.task_id_c,
            completed: subtask.completed_c || false
          };
        }
      }
    } catch (error) {
      console.error("Error creating subtask:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Update subtask
  async update(subtaskId, subtaskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: subtaskId,
          Name: subtaskData.name,
          name_c: subtaskData.name,
          completed_c: subtaskData.completed
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          const subtask = successful[0].data;
          return {
            Id: subtask.Id,
            name: subtask.name_c || subtask.Name,
            taskId: subtask.task_id_c?.Id || subtask.task_id_c,
            completed: subtask.completed_c || false
          };
        }
      }
    } catch (error) {
      console.error("Error updating subtask:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Delete subtask
  async delete(subtaskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [subtaskId]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting subtask:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const subtaskService = new SubtaskService();