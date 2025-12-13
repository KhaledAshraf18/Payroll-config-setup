'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { signingBonusesApi } from '@/lib/api/payroll-configuration/signing-bonuses';
import { SigningBonus } from '@/lib/api/payroll-configuration/types';

export default function EditSigningBonusPage() {
  const params = useParams();
  const router = useRouter();
  const signingBonusId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    paymentTerms: '',
    eligibilityCriteria: '',
    description: '',
  });

  useEffect(() => {
    loadSigningBonus();
  }, [signingBonusId]);

  const loadSigningBonus = async () => {
    setIsLoadingData(true);
    try {
      const signingBonus = await signingBonusesApi.getById(signingBonusId);
      if (signingBonus.status !== 'draft') {
        setError('Only draft signing bonuses can be edited.');
        return;
      }
      setFormData({
        name: signingBonus.name || '',
        amount: String(signingBonus.amount || ''),
        paymentTerms: signingBonus.paymentTerms || '',
        eligibilityCriteria: signingBonus.eligibilityCriteria || '',
        description: signingBonus.description || '',
      });
    } catch (err) {
      console.error('Error loading signing bonus:', err);
      setError(err instanceof Error ? err.message : 'Failed to load signing bonus');
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
        throw new Error('Signing bonus name is required');
      }
      if (!formData.amount || parseFloat(formData.amount) < 0) {
        throw new Error('Signing bonus amount must be non-negative');
      }
      if (!formData.paymentTerms.trim()) {
        throw new Error('Payment terms are required');
      }
      
      // Prepare data for API
      const signingBonusData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        paymentTerms: formData.paymentTerms,
        eligibilityCriteria: formData.eligibilityCriteria || undefined,
        description: formData.description || undefined,
      };
      
      await signingBonusesApi.update(signingBonusId, signingBonusData);
      
      // Redirect to signing bonuses list
      router.push('/dashboard/payroll-configuration/signing-bonuses');
    } catch (err) {
      console.error('Error updating signing bonus:', err);
      setError(err instanceof Error ? err.message : 'Failed to update signing bonus');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <p className="text-gray-500">Loading signing bonus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Signing Bonus</h1>
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
                Bonus Name *
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
                Amount (EGP) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Terms *
              </label>
              <textarea
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                required
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Eligibility Criteria
              </label>
              <textarea
                name="eligibilityCriteria"
                value={formData.eligibilityCriteria}
                onChange={handleChange}
                rows={3}
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

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
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

