'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';

export default function EditTaxRulePage() {
  const params = useParams();
  const router = useRouter();
  const taxRuleId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    description: '',
  });

  useEffect(() => {
    loadTaxRule();
  }, [taxRuleId]);

  const loadTaxRule = async () => {
    setIsLoadingData(true);
    try {
      const taxRule = await taxRulesApi.getById(taxRuleId);
      setFormData({
        name: taxRule.name || '',
        rate: String(taxRule.rate ?? ''),
        description: taxRule.description || '',
      });
    } catch (err) {
      console.error('Error loading tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tax rule');
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
      
      console.log('Updating tax rule with data:', taxRuleData);
      await taxRulesApi.update(taxRuleId, taxRuleData);
      
      // Redirect to tax rules list
      router.push('/dashboard/payroll-configuration/tax-rules');
    } catch (err) {
      console.error('Error updating tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to update tax rule');
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


  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading tax rule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Tax Rule</h1>
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
              />
            </div>

          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Editing this tax rule will set its status back to Draft and require re-approval.
            </p>
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

