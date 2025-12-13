'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';
import { InsuranceBracket } from '@/lib/api/payroll-configuration/types';

export default function InsuranceBracketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const insuranceBracketId = params.id as string;
  const [insuranceBracket, setInsuranceBracket] = useState<InsuranceBracket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsuranceBracket();
  }, [insuranceBracketId]);

  const loadInsuranceBracket = async () => {
    try {
      setIsLoading(true);
      const data = await insuranceBracketsApi.getById(insuranceBracketId);
      setInsuranceBracket(data);
    } catch (err) {
      console.error('Error loading insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insurance bracket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (insuranceBracket && insuranceBracket.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/insurance-brackets/${insuranceBracketId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading insurance bracket...</p>
        </div>
      </div>
    );
  }

  if (error || !insuranceBracket) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Insurance bracket not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Insurance Bracket</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={insuranceBracket.status} />
              <span className="text-sm text-gray-500">ID: {insuranceBracket._id}</span>
            </div>
          </div>
        </div>
        
        {insuranceBracket.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Insurance Bracket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Bracket Details</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Salary Range</label>
                <p className="mt-1 text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EGP'
                  }).format(insuranceBracket.minSalary)} - {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EGP'
                  }).format(insuranceBracket.maxSalary)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employee Contribution</label>
                <p className="mt-1 text-gray-900">{insuranceBracket.employeeContribution}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employer Contribution</label>
                <p className="mt-1 text-gray-900">{insuranceBracket.employerContribution}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Contribution</label>
                <p className="mt-1 text-gray-900 font-semibold">
                  {insuranceBracket.employeeContribution + insuranceBracket.employerContribution}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="mt-1 text-sm text-gray-900">{insuranceBracket.createdBy || 'N/A'}</p>
            </div>
            {insuranceBracket.approvedBy && (
              <div>
                <label className="text-sm font-medium text-gray-500">Approved By</label>
                <p className="mt-1 text-sm text-gray-900">{insuranceBracket.approvedBy}</p>
              </div>
            )}
            {insuranceBracket.approvedAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">Approved At</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(insuranceBracket.approvedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {insuranceBracket.createdAt ? new Date(insuranceBracket.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {insuranceBracket.updatedAt ? new Date(insuranceBracket.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

