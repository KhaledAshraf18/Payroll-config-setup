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
    taxType: 'income' as 'income' | 'social_security' | 'health' | 'other',
    rate: '',
    description: '',
    brackets: [] as Array<{ min: number; max?: number; rate: number }>,
  });
  const [showBrackets, setShowBrackets] = useState(false);

  useEffect(() => {
    loadTaxRule();
  }, [taxRuleId]);

  const loadTaxRule = async () => {
    setIsLoadingData(true);
    try {
      const taxRule = await taxRulesApi.getById(taxRuleId);
      setFormData({
        name: taxRule.name || '',
        taxType: taxRule.taxType || 'income',
        rate: String(taxRule.rate || ''),
        description: taxRule.description || '',
        brackets: taxRule.brackets || [],
      });
      setShowBrackets(!!(taxRule.brackets && taxRule.brackets.length > 0));
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
      
      // Prepare data for API - editing approved rules sets them back to draft
      const taxRuleData = {
        name: formData.name,
        taxType: formData.taxType as 'income' | 'social_security' | 'health' | 'other',
        rate: parseFloat(formData.rate),
        description: formData.description || undefined,
        brackets: formData.brackets.length > 0 ? formData.brackets : undefined,
        status: 'draft' as const, // Always set to draft when editing
      };
      
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

  const addBracket = () => {
    setFormData(prev => ({
      ...prev,
      brackets: [...prev.brackets, { min: 0, rate: 0 }]
    }));
  };

  const removeBracket = (index: number) => {
    setFormData(prev => ({
      ...prev,
      brackets: prev.brackets.filter((_, i) => i !== index)
    }));
  };

  const updateBracket = (index: number, field: 'min' | 'max' | 'rate', value: string) => {
    setFormData(prev => ({
      ...prev,
      brackets: prev.brackets.map((bracket, i) => 
        i === index ? { ...bracket, [field]: field === 'max' && value === '' ? undefined : parseFloat(value) || 0 } : bracket
      )
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
                Tax Type *
              </label>
              <select
                name="taxType"
                value={formData.taxType}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="income">Income Tax</option>
                <option value="social_security">Social Security</option>
                <option value="health">Health Tax</option>
                <option value="other">Other</option>
              </select>
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

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Progressive Tax Brackets (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowBrackets(!showBrackets)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showBrackets ? 'Hide' : 'Show'} Brackets
                </button>
              </div>
              {showBrackets && (
                <div className="mt-4 space-y-4">
                  {formData.brackets.map((bracket, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">Min Amount</label>
                        <input
                          type="number"
                          value={bracket.min}
                          onChange={(e) => updateBracket(index, 'min', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">Max Amount (optional)</label>
                        <input
                          type="number"
                          value={bracket.max || ''}
                          onChange={(e) => updateBracket(index, 'max', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500">Rate (%)</label>
                        <input
                          type="number"
                          value={bracket.rate}
                          onChange={(e) => updateBracket(index, 'rate', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBracket(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBracket}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    + Add Bracket
                  </button>
                </div>
              )}
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

