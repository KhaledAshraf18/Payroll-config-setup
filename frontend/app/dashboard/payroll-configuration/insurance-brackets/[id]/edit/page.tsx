'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';
import { InsuranceBracket } from '@/lib/api/payroll-configuration/types';

export default function EditInsuranceBracketPage() {
  const params = useParams();
  const router = useRouter();
  const insuranceBracketId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    minSalary: '',
    maxSalary: '',
    employeeRate: '',
    employerRate: '',
    amount: '',
  });

  useEffect(() => {
    loadInsuranceBracket();
  }, [insuranceBracketId]);

  const loadInsuranceBracket = async () => {
    setIsLoadingData(true);
    try {
      const insuranceBracket = await insuranceBracketsApi.getById(insuranceBracketId);
      if (insuranceBracket.status !== 'draft') {
        setError('Only draft insurance brackets can be edited.');
        return;
      }
      setFormData({
        name: (insuranceBracket as any).name ?? '',
        minSalary: insuranceBracket.minSalary ? String(insuranceBracket.minSalary) : '',
        maxSalary: insuranceBracket.maxSalary ? String(insuranceBracket.maxSalary) : '',
        employeeRate: (insuranceBracket as any).employeeRate !== undefined ? String((insuranceBracket as any).employeeRate) : '',
        employerRate: (insuranceBracket as any).employerRate !== undefined ? String((insuranceBracket as any).employerRate) : '',
        amount: (insuranceBracket as any).amount !== undefined ? String((insuranceBracket as any).amount) : '',
      });
    } catch (err) {
      console.error('Error loading insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insurance bracket');
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
      const minSalary = parseFloat(formData.minSalary);
      const maxSalary = parseFloat(formData.maxSalary);
      const employeeRate = parseFloat(formData.employeeRate);
      const employerRate = parseFloat(formData.employerRate);

      if (!formData.name?.trim()) {
        throw new Error('Insurance bracket name is required');
      }
      if (!formData.minSalary || minSalary < 0) {
        throw new Error('Minimum salary must be non-negative');
      }
      if (!formData.maxSalary || maxSalary < 0) {
        throw new Error('Maximum salary must be non-negative');
      }
      if (minSalary >= maxSalary) {
        throw new Error('Minimum salary must be less than maximum salary');
      }
      if (!formData.employeeRate || employeeRate < 0 || employeeRate > 100) {
        throw new Error('Employee rate must be between 0 and 100');
      }
      if (!formData.employerRate || employerRate < 0 || employerRate > 100) {
        throw new Error('Employer rate must be between 0 and 100');
      }
      
      // Prepare data for API - DTO accepts: name, amount?, minSalary, maxSalary, employeeRate, employerRate
      const insuranceBracketData: any = {
        name: formData.name.trim(),
        minSalary,
        maxSalary,
        employeeRate,
        employerRate,
      };
      
      // Only include amount if provided
      if (formData.amount && formData.amount.trim()) {
        insuranceBracketData.amount = parseFloat(formData.amount);
      }
      
      await insuranceBracketsApi.update(insuranceBracketId, insuranceBracketData);
      
      // Redirect to insurance brackets list
      router.push('/dashboard/payroll-configuration/insurance-brackets');
    } catch (err) {
      console.error('Error updating insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to update insurance bracket');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading insurance bracket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Insurance Bracket</h1>
      </div>

      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Insurance Bracket Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Low Income Bracket"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Salary (EGP) *
              </label>
              <input
                type="number"
                name="minSalary"
                value={formData.minSalary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Salary (EGP) *
              </label>
              <input
                type="number"
                name="maxSalary"
                value={formData.maxSalary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee Rate (%) *
              </label>
              <input
                type="number"
                name="employeeRate"
                value={formData.employeeRate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employer Rate (%) *
              </label>
              <input
                type="number"
                name="employerRate"
                value={formData.employerRate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fixed Amount (EGP) (Optional)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional fixed amount"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
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

