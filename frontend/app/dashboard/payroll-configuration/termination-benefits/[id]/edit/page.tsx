'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';

export default function EditTerminationBenefitPage() {
  const params = useParams();
  const router = useRouter();
  const terminationBenefitId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    benefitType: 'severance' as 'severance' | 'resignation' | 'retirement' | 'other',
    calculationMethod: '',
    eligibilityCriteria: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    loadTerminationBenefit();
  }, [terminationBenefitId]);

  const loadTerminationBenefit = async () => {
    setIsLoadingData(true);
    try {
      const terminationBenefit = await terminationBenefitsApi.getById(terminationBenefitId);
      if (terminationBenefit.status !== 'draft') {
        setError('Only draft termination benefits can be edited.');
        return;
      }
      setFormData({
        name: terminationBenefit.name || '',
        benefitType: terminationBenefit.benefitType || 'severance',
        calculationMethod: terminationBenefit.calculationMethod || '',
        eligibilityCriteria: terminationBenefit.eligibilityCriteria || '',
        amount: terminationBenefit.amount ? String(terminationBenefit.amount) : '',
        description: terminationBenefit.description || '',
      });
    } catch (err) {
      console.error('Error loading termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to load termination benefit');
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
        throw new Error('Termination benefit name is required');
      }
      if (!formData.calculationMethod.trim()) {
        throw new Error('Calculation method is required');
      }
      
      // Prepare data for API
      const terminationBenefitData = {
        name: formData.name,
        benefitType: formData.benefitType as 'severance' | 'resignation' | 'retirement' | 'other',
        calculationMethod: formData.calculationMethod,
        eligibilityCriteria: formData.eligibilityCriteria || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        description: formData.description || undefined,
      };
      
      await terminationBenefitsApi.update(terminationBenefitId, terminationBenefitData);
      
      // Redirect to termination benefits list
      router.push('/dashboard/payroll-configuration/termination-benefits');
    } catch (err) {
      console.error('Error updating termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update termination benefit');
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
          <p className="text-gray-500">Loading termination benefit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Termination Benefit</h1>
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
                Benefit Name *
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
                Benefit Type *
              </label>
              <select
                name="benefitType"
                value={formData.benefitType}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="severance">Severance</option>
                <option value="resignation">Resignation</option>
                <option value="retirement">Retirement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Calculation Method *
              </label>
              <textarea
                name="calculationMethod"
                value={formData.calculationMethod}
                onChange={handleChange}
                required
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fixed Amount (EGP) - Optional
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
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
              onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
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

