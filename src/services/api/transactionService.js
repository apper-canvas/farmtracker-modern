class TransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform data for UI compatibility
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.amount_c,
        description: transaction.description_c,
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const transactionId = parseInt(id);
      if (isNaN(transactionId)) {
        throw new Error('Invalid transaction ID');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, transactionId, params);
      
      if (!response.success || !response.data) {
        throw new Error('Transaction not found');
      }

      const transaction = response.data;
      return {
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.amount_c,
        description: transaction.description_c,
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: `${transactionData.type} - ${transactionData.category}`,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: parseFloat(transactionData.amount),
          description_c: transactionData.description,
          date_c: transactionData.date,
          farm_id_c: transactionData.farmId ? parseInt(transactionData.farmId) : null
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
          console.error(`Failed to create ${failed.length} transactions:`, failed);
          throw new Error('Failed to create transaction');
        }
        
        if (successful.length > 0) {
          const transaction = successful[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c,
            category: transaction.category_c,
            amount: transaction.amount_c,
            description: transaction.description_c,
            date: transaction.date_c,
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
          };
        }
      }
      
      throw new Error('No transaction created');
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      const transactionId = parseInt(id);
      if (isNaN(transactionId)) {
        throw new Error('Invalid transaction ID');
      }

      const params = {
        records: [{
          Id: transactionId,
          Name: `${transactionData.type} - ${transactionData.category}`,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: parseFloat(transactionData.amount),
          description_c: transactionData.description,
          date_c: transactionData.date,
          farm_id_c: transactionData.farmId ? parseInt(transactionData.farmId) : null
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
          console.error(`Failed to update ${failed.length} transactions:`, failed);
          throw new Error('Failed to update transaction');
        }
        
        if (successful.length > 0) {
          const transaction = successful[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c,
            category: transaction.category_c,
            amount: transaction.amount_c,
            description: transaction.description_c,
            date: transaction.date_c,
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
          };
        }
      }
      
      throw new Error('Transaction update failed');
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const transactionId = parseInt(id);
      if (isNaN(transactionId)) {
        throw new Error('Invalid transaction ID');
      }

      const params = { 
        RecordIds: [transactionId]
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
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          throw new Error('Failed to delete transaction');
        }
        
        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();