"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  Upload,
  FileText,
  DollarSign,
  Tag,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

interface TransactionManagerProps {
  franchiseId: Id<"franchise">;
}

export default function TransactionManager({ franchiseId }: TransactionManagerProps) {
  const { formatAmount } = useGlobalCurrency();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('income');

  // Form state
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    description: '',
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    verificationMethod: '',
    tags: [] as string[],
    notes: '',
  });

  const [newTag, setNewTag] = useState('');

  // Queries
  const transactions = useQuery(api.financialTransactions.getTransactions, {
    franchiseId,
    limit: 20,
  });
  const categories = useQuery(api.financialTransactions.getTransactionCategories, {});
  const financialSummary = useQuery(api.financialTransactions.getFinancialSummary, {
    franchiseId,
    period: "month",
  });

  // Mutations
  const addTransaction = useMutation(api.financialTransactions.addTransaction);
  const updateTransactionStatus = useMutation(api.financialTransactions.updateTransactionStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addTransaction({
        franchiseId,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: 'USD', // TODO: Get from business settings
        transactionDate: new Date(formData.transactionDate).getTime(),
        verificationMethod: formData.verificationMethod || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        notes: formData.notes || undefined,
      });

      toast.success('Transaction added successfully');
      setIsAddDialogOpen(false);
      
      // Reset form
      setFormData({
        type: 'income',
        category: '',
        description: '',
        amount: '',
        transactionDate: new Date().toISOString().split('T')[0],
        verificationMethod: '',
        tags: [],
        notes: '',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleApproveTransaction = async (transactionId: Id<"financialTransactions">) => {
    try {
      await updateTransactionStatus({
        transactionId,
        status: 'approved',
      });
      toast.success('Transaction approved');
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast.error('Failed to approve transaction');
    }
  };

  const handleRejectTransaction = async (transactionId: Id<"financialTransactions">) => {
    try {
      await updateTransactionStatus({
        transactionId,
        status: 'rejected',
        rejectionReason: 'Rejected by manager',
      });
      toast.success('Transaction rejected');
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast.error('Failed to reject transaction');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(financialSummary?.summary.totalIncome || 0)}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(financialSummary?.summary.totalExpenses || 0)}
              </p>
            </div>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className={`text-2xl font-bold ${
                (financialSummary?.summary.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatAmount(financialSummary?.summary.netProfit || 0)}
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Financial Transactions</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'income' | 'expense') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.[formData.type]?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter transaction description"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Transaction Date */}
                <div className="space-y-2">
                  <Label>Transaction Date</Label>
                  <Input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
                    required
                  />
                </div>

                {/* Verification Method */}
                <div className="space-y-2">
                  <Label>Verification Method (Optional)</Label>
                  <Select 
                    value={formData.verificationMethod} 
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, verificationMethod: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="bank_statement">Bank Statement</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Transaction
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions?.map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-600">
                    {transaction.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </p>
                  {transaction.tags && transaction.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {transaction.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {transaction.frcTokensIssued && (
                    <p className="text-sm text-purple-600">+{transaction.frcTokensIssued} FRC tokens</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                  </p>
                  <Badge variant={
                    transaction.status === 'approved' ? 'default' : 
                    transaction.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {transaction.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {transaction.status === 'rejected' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {transaction.status}
                  </Badge>
                </div>
                {transaction.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleApproveTransaction(transaction._id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectTransaction(transaction._id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
