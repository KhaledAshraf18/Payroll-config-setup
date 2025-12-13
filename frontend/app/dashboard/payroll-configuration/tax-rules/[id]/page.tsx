'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';

export default function TaxRuleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taxRuleId = params.id as string;
  const [taxRule, setTaxRule] = useState<TaxRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaxRule();
  }, [taxRuleId]);

  const loadTaxRule = async () => {
    try {
      setIsLoading(true);
      const data = await taxRulesApi.getById(taxRuleId);
      setTaxRule(data);
    } catch (err) {
      console.error('Error loading tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tax rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    // Tax rules can be edited even if approved (they go back to draft)
    router.push(`/dashboard/payroll-configuration/tax-rules/${taxRuleId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading tax rule...</p>
        </div>
      </div>
    );
  }

  if (error || !taxRule) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Tax rule not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{taxRule.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={taxRule.status} />
              <span className="text-sm text-gray-500">ID: {taxRule._id}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          {taxRule.status === 'approved' ? 'Update Tax Rule (will set to Draft)' : 'Edit Tax Rule'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tax Rule Details</h2>
          <div className="space-y-6">
            {taxRule.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-700">{taxRule.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tax Type</label>
                <p className="mt-1 capitalize text-gray-900">{taxRule.taxType.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Base Rate</label>
                <p className="mt-1 text-gray-900">{taxRule.rate}%</p>
              </div>
              {taxRule.brackets && taxRule.brackets.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Progressive Tax Brackets</label>
                  <div className="space-y-2">
                    {taxRule.brackets.map((bracket, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'EGP'
                            }).format(bracket.min)} - {bracket.max ? 
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EGP'
                              }).format(bracket.max) : '∞'}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{bracket.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="mt-1 text-sm text-gray-900">{taxRule.createdBy || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(taxRule.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(taxRule.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

