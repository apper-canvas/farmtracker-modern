import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";

const TransactionForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const expenseCategories = [
    { value: "seeds", label: "Seeds & Plants" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "pesticides", label: "Pesticides" },
    { value: "equipment", label: "Equipment" },
    { value: "fuel", label: "Fuel" },
    { value: "labor", label: "Labor" },
    { value: "maintenance", label: "Maintenance" },
    { value: "utilities", label: "Utilities" },
    { value: "other", label: "Other Expenses" }
  ];

  const incomeCategories = [
    { value: "crop_sales", label: "Crop Sales" },
    { value: "livestock", label: "Livestock Sales" },
    { value: "subsidies", label: "Government Subsidies" },
    { value: "insurance", label: "Insurance Payout" },
    { value: "services", label: "Farm Services" },
    { value: "other", label: "Other Income" }
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || "expense",
        category: transaction.category || "",
        amount: transaction.amount?.toString() || "",
        description: transaction.description || "",
        date: transaction.date ? format(new Date(transaction.date), "yyyy-MM-dd") : ""
      });
    } else {
      // Set default date to today
      setFormData(prev => ({
        ...prev,
        date: format(new Date(), "yyyy-MM-dd")
      }));
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset category when type changes
    if (name === "type") {
      setFormData(prev => ({
        ...prev,
        category: ""
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        farmId: "1" // Default farm ID
      };

      let savedTransaction;
      if (transaction) {
        savedTransaction = await transactionService.update(transaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        savedTransaction = await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }
      
      onSave(savedTransaction);
    } catch (error) {
      toast.error("Failed to save transaction: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="DollarSign" className="w-5 h-5 text-green-600" />
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
            
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            >
              <option value="">Select category</option>
              {currentCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Amount ($)"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            
            <Input
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional details about this transaction..."
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              )}
              {transaction ? "Update Transaction" : "Add Transaction"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;