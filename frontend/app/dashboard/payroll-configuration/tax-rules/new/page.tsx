'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';

export default function NewTaxRulePage() {
  // Only Legal Admin can create new tax rules
  useRequireAuth(SystemRole.LEGAL_POLICY_ADMIN, '/dashboard');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Tax rule name is required');
      }
      if (!formData.rate || parseFloat(formData.rate) < 0 || parseFloat(formData.rate) > 100) {
        throw new Error('Tax rate must be between 0 and 100');
      }
      
      // Prepare data for API - backend only expects name, rate, and optional description
      const taxRuleData = {
        name: formData.name.trim(),
        rate: parseFloat(formData.rate),
        description: formData.description?.trim() || undefined,
      };
      
      console.log('Creating tax rule with data:', taxRuleData);
      await taxRulesApi.create(taxRuleData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/tax-rules');
    } catch (err) {
      console.error('Error creating tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to create tax rule');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Tax Rule</h1>
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
                Tax Rule Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Income Tax 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Rate (%) *
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Additional details about this tax rule..."
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Tax Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

