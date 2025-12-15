'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { payGradesApi } from '@/lib/api/payroll-configuration/payGrades';

export default function NewPayGradePage() {
  // Only Payroll Specialist can create new pay grades
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    minSalary: '',
    maxSalary: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Pay grade name is required');
      }
      if (!formData.minSalary || parseFloat(formData.minSalary) < 6000) {
        throw new Error('Base salary must be at least 6000');
      }
      if (!formData.maxSalary || parseFloat(formData.maxSalary) < 6000) {
        throw new Error('Gross salary must be at least 6000');
      }
      if (parseFloat(formData.maxSalary) < parseFloat(formData.minSalary)) {
        throw new Error('Gross salary must be greater than or equal to base salary');
      }
      
      // Prepare data for API - DTO only accepts: grade, baseSalary, grossSalary
      const payGradeData = {
        name: formData.name,
        minSalary: parseFloat(formData.minSalary),
        maxSalary: parseFloat(formData.maxSalary),
      };
      
      await payGradesApi.create(payGradeData);
      
      // Redirect to pay grades list
      router.push('/dashboard/payroll-configuration/pay-grades');
    } catch (err) {
      console.error('Error creating pay grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to create pay grade');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Calculate if the form should be disabled
  const isFormInvalid = () => {
    if (!formData.minSalary || !formData.maxSalary) return false;
    const min = parseFloat(formData.minSalary);
    const max = parseFloat(formData.maxSalary);
    return max < min;
  };

  const isSubmitDisabled = isLoading || isFormInvalid();

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Pay Grade</h1>
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
                Pay Grade Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Senior Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Salary *
              </label>
              <input
                type="number"
                name="minSalary"
                value={formData.minSalary}
                onChange={handleChange}
                required
                min="6000"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="6000"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum: 6000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gross Salary *
              </label>
              <input
                type="number"
                name="maxSalary"
                value={formData.maxSalary}
                onChange={handleChange}
                required
                min="6000"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="6000"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum: 6000, must be ≥ base salary</p>
            </div>
          </div>
          {isFormInvalid() && (
            <p className="text-sm text-red-600">Gross salary must be greater than or equal to base salary.</p>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Pay Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}