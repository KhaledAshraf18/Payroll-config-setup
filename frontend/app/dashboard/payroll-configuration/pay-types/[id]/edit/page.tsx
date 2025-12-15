'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { payTypesApi } from '@/lib/api/payroll-configuration/payTypes';

export default function EditPayTypePage() {
  const params = useParams();
  const router = useRouter();
  const payTypeId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'salary' as 'hourly' | 'salary' | 'commission' | 'contract',
    amount: '',
  });

  useEffect(() => {
    loadPayType();
  }, [payTypeId]);

  const loadPayType = async () => {
    setIsLoadingData(true);
    try {
      const payType = await payTypesApi.getById(payTypeId);
      const payTypeWithAmount = payType as any;
      setFormData({
        type: payType.type ?? 'salary',
        amount: payTypeWithAmount._amount ? String(payTypeWithAmount._amount) : '',
      });
    } catch (err) {
      console.error('Error loading pay type:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pay type');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.type) {
        throw new Error('Pay type is required');
      }
      
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (!formData.amount || isNaN(amount) || amount < 6000) {
        throw new Error('Pay type amount must be at least 6000');
      }
      
      // Prepare data for API - DTO only accepts: type, amount
      const payTypeData = {
        type: formData.type as 'hourly' | 'salary' | 'commission' | 'contract',
        amount: amount,
      };
      
      await payTypesApi.update(payTypeId, payTypeData);
      
      // Redirect to pay types list
      router.push('/dashboard/payroll-configuration/pay-types');
    } catch (err) {
      console.error('Error updating pay type:', err);
      setError(err instanceof Error ? err.message : 'Failed to update pay type');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading pay type...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/pay-types')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Pay Type</h1>
      </div>

      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
                <option value="commission">Commission</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount * (Minimum 6000)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="6000"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="6000"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/pay-types')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
