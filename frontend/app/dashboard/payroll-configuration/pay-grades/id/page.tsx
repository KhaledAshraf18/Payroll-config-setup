'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { payGradesApi } from '@/lib/api/payroll-configuration/payGrades';

export default function PayGradeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payGradeId = params.id as string;
  const [payGrade, setPayGrade] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayGrade();
  }, [payGradeId]);

  const loadPayGrade = async () => {
    try {
      const data = await payGradesApi.getById(payGradeId);
      setPayGrade(data);
    } catch (error) {
      console.error('Error loading pay grade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (payGrade?.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-grades/${payGradeId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading pay grade...</p>
        </div>
      </div>
    );
  }

  if (!payGrade) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Pay grade not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{payGrade.name || 'Pay Grade'}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={payGrade.status} />
              <span className="text-sm text-gray-500">ID: {payGrade.id}</span>
            </div>
          </div>
        </div>
        
        {payGrade.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Pay Grade
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Salary Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Range</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Base Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(payGrade.minSalary || 0)}
                  </p>
                </div>
                <div className="text-gray-400 mx-4">→</div>
                <div>
                  <p className="text-sm text-gray-500">Gross Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(payGrade.maxSalary || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-sm text-gray-900">
                  {(() => {
                    const createdBy = payGrade.createdBy;
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
                  {payGrade.createdAt ? new Date(payGrade.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {payGrade.updatedAt ? new Date(payGrade.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Version</label>
                <p className="mt-1 text-sm text-gray-900">{payGrade.version || 1}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}