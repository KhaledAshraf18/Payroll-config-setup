'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { allowancesApi } from '@/lib/api/payroll-configuration/allowances';

export default function AllowanceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const allowanceId = params.id as string;
  const [allowance, setAllowance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllowance();
  }, [allowanceId]);

  const loadAllowance = async () => {
    try {
      const data = await allowancesApi.getById(allowanceId);
      setAllowance(data);
    } catch (error) {
      console.error('Error loading allowance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (allowance?.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/allowances/${allowanceId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading allowance...</p>
        </div>
      </div>
    );
  }

  if (!allowance) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Allowance not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/allowances')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{allowance.name || 'Allowance'}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={allowance.status} />
              <span className="text-sm text-gray-500">ID: {allowance.id}</span>
            </div>
          </div>
        </div>
        
        {allowance.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Allowance
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Allowance Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Allowance Name</label>
                <p className="mt-1 text-gray-900">{allowance.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="mt-1 text-gray-900 font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EGP'
                  }).format(allowance.amount || 0)}
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
              <p className="mt-1 text-sm text-gray-900">
                {(() => {
                  const createdBy = allowance.createdBy;
                  if (!createdBy) return 'N/A';
                  if (typeof createdBy === 'string') return createdBy;
                  if (typeof createdBy === 'object') {
                    const obj = createdBy as any;
                    if (obj.firstName && obj.lastName) return `${obj.firstName} ${obj.lastName}`;
                    if (obj.fullName) return obj.fullName;
                    if (obj.email) return obj.email;
                    return 'Unknown';
                  }
                  return 'N/A';
                })()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {allowance.createdAt ? new Date(allowance.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {allowance.updatedAt ? new Date(allowance.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="mt-1 text-sm text-gray-900">{allowance.version || 1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}