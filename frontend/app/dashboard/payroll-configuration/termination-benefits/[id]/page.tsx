'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';

export default function TerminationBenefitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const terminationBenefitId = params.id as string;
  const [terminationBenefit, setTerminationBenefit] = useState<TerminationBenefit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTerminationBenefit();
  }, [terminationBenefitId]);

  const loadTerminationBenefit = async () => {
    try {
      setIsLoading(true);
      const data = await terminationBenefitsApi.getById(terminationBenefitId);
      setTerminationBenefit(data);
    } catch (err) {
      console.error('Error loading termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to load termination benefit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (terminationBenefit && terminationBenefit.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/termination-benefits/${terminationBenefitId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading termination benefit...</p>
        </div>
      </div>
    );
  }

  if (error || !terminationBenefit) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Termination benefit not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{terminationBenefit.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={terminationBenefit.status} />
              <span className="text-sm text-gray-500">ID: {terminationBenefit._id}</span>
            </div>
          </div>
        </div>
        
        {terminationBenefit.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Termination Benefit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Termination Benefit Details</h2>
          <div className="space-y-6">
            {terminationBenefit.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-700">{terminationBenefit.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Benefit Type</label>
                <p className="mt-1 capitalize text-gray-900">{terminationBenefit.benefitType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Calculation Method</label>
                <p className="mt-1 text-gray-900">{terminationBenefit.calculationMethod}</p>
              </div>
              {terminationBenefit.amount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Fixed Amount</label>
                  <p className="mt-1 text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(terminationBenefit.amount)}
                  </p>
                </div>
              )}
              {terminationBenefit.eligibilityCriteria && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Eligibility Criteria</label>
                  <p className="mt-1 text-gray-700">{terminationBenefit.eligibilityCriteria}</p>
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
              <p className="mt-1 text-sm text-gray-900">{terminationBenefit.createdBy || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(terminationBenefit.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(terminationBenefit.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

