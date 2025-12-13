'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';

export default function NewInsuranceBracketPage() {
  // Only Payroll Specialist can create new insurance brackets
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    minSalary: '',
    maxSalary: '',
    employeeContribution: '',
    employerContribution: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      const minSalary = parseFloat(formData.minSalary);
      const maxSalary = parseFloat(formData.maxSalary);
      const employeeContribution = parseFloat(formData.employeeContribution);
      const employerContribution = parseFloat(formData.employerContribution);

      if (!formData.minSalary || minSalary < 0) {
        throw new Error('Minimum salary must be non-negative');
      }
      if (!formData.maxSalary || maxSalary < 0) {
        throw new Error('Maximum salary must be non-negative');
      }
      if (minSalary >= maxSalary) {
        throw new Error('Minimum salary must be less than maximum salary');
      }
      if (!formData.employeeContribution || employeeContribution < 0 || employeeContribution > 100) {
        throw new Error('Employee contribution must be between 0 and 100');
      }
      if (!formData.employerContribution || employerContribution < 0 || employerContribution > 100) {
        throw new Error('Employer contribution must be between 0 and 100');
      }
      
      // Prepare data for API
      const insuranceBracketData = {
        minSalary,
        maxSalary,
        employeeContribution,
        employerContribution,
        status: 'draft' as const,
      };
      
      await insuranceBracketsApi.create(insuranceBracketData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/insurance-brackets');
    } catch (err) {
      console.error('Error creating insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to create insurance bracket');
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

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Insurance Bracket</h1>
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
                placeholder="0.00"
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
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee Contribution (%) *
              </label>
              <input
                type="number"
                name="employeeContribution"
                value={formData.employeeContribution}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employer Contribution (%) *
              </label>
              <input
                type="number"
                name="employerContribution"
                value={formData.employerContribution}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
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
              {isLoading ? 'Creating...' : 'Create Insurance Bracket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

