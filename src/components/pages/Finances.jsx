import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Layout from "@/components/organisms/Layout";
import TransactionForm from "@/components/organisms/TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
      console.error("Transactions loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = (savedTransaction) => {
    if (editingTransaction) {
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.Id === editingTransaction.Id ? savedTransaction : transaction
        )
      );
    } else {
      setTransactions(prev => [...prev, savedTransaction]);
    }
    
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionService.delete(transactionId);
      setTransactions(prev => prev.filter(transaction => transaction.Id !== transactionId));
      toast.success("Transaction deleted successfully");
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.error("Delete transaction error:", err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    switch (filter) {
      case "income":
        return transaction.type === "income";
      case "expense":
        return transaction.type === "expense";
      default:
        return true;
    }
  });

  // Sort by date (newest first)
  const sortedTransactions = filteredTransactions.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Monthly calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

const formatCurrency = (amount) => {
return new Intl.NumberFormat("en-US", {
style: "currency",
currency: "USD"
}).format(amount);
};

const getCategoryLabel = (category) => {
const categoryLabels = {
// Expenses
"seeds": "Seeds & Plants",
"fertilizer": "Fertilizer",
"pesticides": "Pesticides",
"equipment": "Equipment",
"fuel": "Fuel",
"labor": "Labor",
"maintenance": "Maintenance",
"utilities": "Utilities",
// Income
"crop_sales": "Crop Sales",
"livestock": "Livestock Sales",
"subsidies": "Government Subsidies",
"insurance": "Insurance Payout",
"services": "Farm Services",
"other": "Other"
};

return categoryLabels[category] || category;
};

const exportToCSV = () => {
const headers = ["Date", "Type", "Category", "Description", "Amount"];
const csvContent = [
headers.join(","),
...sortedTransactions.map(transaction => [
format(new Date(transaction.date), "yyyy-MM-dd"),
transaction.type,
getCategoryLabel(transaction.category),
`"${(transaction.description || "").replace(/"/g, '""')}"`,
transaction.amount
].join(","))
].join("\n");

const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = `financial-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
toast.success("CSV export completed successfully");
};

const exportToPDF = () => {
const doc = new jsPDF();
const currentDate = format(new Date(), "MMMM dd, yyyy");
const filterLabel = filter === "all" ? "All Transactions" : 
filter === "income" ? "Income Only" : "Expenses Only";

// Header
doc.setFontSize(20);
doc.text("Financial Report", 20, 30);
doc.setFontSize(12);
doc.text(`Generated on: ${currentDate}`, 20, 40);
doc.text(`Filter: ${filterLabel}`, 20, 50);

// Summary Statistics
doc.setFontSize(14);
doc.text("Summary", 20, 70);
doc.setFontSize(10);
doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 20, 80);
doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, 90);
doc.text(`Net Profit: ${formatCurrency(netProfit)}`, 20, 100);

// Transaction Table
const tableData = sortedTransactions.map(transaction => [
format(new Date(transaction.date), "MMM dd, yyyy"),
transaction.type,
getCategoryLabel(transaction.category),
transaction.description || "-",
formatCurrency(transaction.amount)
]);

doc.autoTable({
head: [["Date", "Type", "Category", "Description", "Amount"]],
body: tableData,
startY: 110,
theme: "striped",
headStyles: { fillColor: [45, 80, 22] },
styles: { fontSize: 8, cellPadding: 3 },
columnStyles: {
0: { cellWidth: 25 },
1: { cellWidth: 20 },
2: { cellWidth: 35 },
3: { cellWidth: 50 },
4: { cellWidth: 25, halign: "right" }
}
});

doc.save(`financial-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
toast.success("PDF export completed successfully");
};

  const filterOptions = [
    { value: "all", label: "All Transactions" },
    { value: "income", label: "Income Only" },
    { value: "expense", label: "Expenses Only" }
  ];

  if (loading) return <Layout title="Finances"><Loading /></Layout>;
  if (error) return <Layout title="Finances"><Error message={error} onRetry={loadTransactions} /></Layout>;

  return (
    <Layout title="Finances">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
            <p className="text-gray-600">Track your farm's income and expenses to monitor profitability</p>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Income</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-900">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingDown" className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${netProfit >= 0 ? "from-blue-50 to-blue-100 border-blue-200" : "from-orange-50 to-orange-100 border-orange-200"}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${netProfit >= 0 ? "text-blue-700" : "text-orange-700"}`}>Net Profit</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-blue-900" : "text-orange-900"}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${netProfit >= 0 ? "from-blue-500 to-blue-700" : "from-orange-500 to-orange-700"} rounded-full flex items-center justify-center`}>
                  <ApperIcon name={netProfit >= 0 ? "DollarSign" : "AlertCircle"} className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">This Month</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TransactionForm
              transaction={editingTransaction}
              onSave={handleSaveTransaction}
              onCancel={handleCancelForm}
            />
          </motion.div>
        )}

        {/* Transactions List */}
        <Card>
          <CardHeader>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
<CardTitle className="flex items-center gap-2">
<ApperIcon name="Receipt" className="w-5 h-5 text-green-600" />
Transaction History ({filteredTransactions.length})
</CardTitle>

<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
<div className="flex gap-2">
<Button
onClick={exportToCSV}
variant="outline"
size="sm"
className="flex items-center gap-2"
disabled={sortedTransactions.length === 0}
>
<ApperIcon name="FileText" className="w-4 h-4" />
Export CSV
</Button>
<Button
onClick={exportToPDF}
variant="outline"
size="sm"
className="flex items-center gap-2"
disabled={sortedTransactions.length === 0}
>
<ApperIcon name="FileDown" className="w-4 h-4" />
Export PDF
</Button>
</div>
<Select
value={filter}
onChange={(e) => setFilter(e.target.value)}
className="min-w-[180px]"
>
{filterOptions.map(option => (
<option key={option.value} value={option.value}>
{option.label}
</option>
))}
</Select>
</div>
</div>
          </CardHeader>
          <CardContent>
            {sortedTransactions.length === 0 ? (
              <Empty
                title={filter === "all" ? "No transactions recorded" : `No ${filter} transactions`}
                description={
                  filter === "all"
                    ? "Start tracking your farm's financial activity by adding your first transaction."
                    : `There are currently no ${filter} transactions recorded.`
                }
                icon="Receipt"
                actionLabel={filter === "all" ? "Add First Transaction" : undefined}
                onAction={filter === "all" ? () => setShowForm(true) : undefined}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                      >
                        <td className="py-4 px-4">
                          <span className="text-gray-700">
                            {format(new Date(transaction.date), "MMM dd, yyyy")}
                          </span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <Badge variant={transaction.type === "income" ? "success" : "error"}>
                            <ApperIcon 
                              name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                              className="w-3 h-3 mr-1" 
                            />
                            <span className="capitalize">{transaction.type}</span>
                          </Badge>
                        </td>
                        
                        <td className="py-4 px-4">
                          <span className="text-gray-700">
                            {getCategoryLabel(transaction.category)}
                          </span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <span className="text-gray-700">
                            {transaction.description || "-"}
                          </span>
                        </td>
                        
                        <td className="py-4 px-4 text-right">
                          <span className={`font-semibold ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
                              title="Edit transaction"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.Id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                              title="Delete transaction"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Finances;