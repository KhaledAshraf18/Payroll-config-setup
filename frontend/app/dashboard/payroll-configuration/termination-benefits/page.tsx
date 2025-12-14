'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';

export default function TerminationBenefitsPage() {
  // Only Payroll Specialist can create/edit termination benefits
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  
  const router = useRouter();
  const [terminationBenefits, setTerminationBenefits] = useState<TerminationBenefit[]>([]);
  const [allTerminationBenefits, setAllTerminationBenefits] = useState<TerminationBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTerminationBenefits();
  }, [statusFilter]);

  const loadTerminationBenefits = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await terminationBenefitsApi.getAll(status);
      setAllTerminationBenefits(data);
      setTerminationBenefits(data);
    } catch (error) {
      console.error('Error loading termination benefits:', error);
      setTerminationBenefits([]);
      setAllTerminationBenefits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Benefit Name',
      render: (item: TerminationBenefit) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
      )
    },
    { 
      key: 'benefitType', 
      label: 'Type',
      render: (item: TerminationBenefit) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.benefitType === 'severance' ? 'bg-blue-100 text-blue-800' :
          item.benefitType === 'resignation' ? 'bg-green-100 text-green-800' :
          item.benefitType === 'retirement' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.benefitType}
        </span>
      )
    },
    { 
      key: 'calculationMethod', 
      label: 'Calculation Method',
      render: (item: TerminationBenefit) => (
        <span className="text-sm text-gray-700">{item.calculationMethod}</span>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (item: TerminationBenefit) => (
        item.amount ? (
          <div className="font-medium text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EGP'
            }).format(item.amount)}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Calculated</span>
        )
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: TerminationBenefit) => <StatusBadge status={item.status} />
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/termination-benefits/new');
  };

  const handleView = (item: TerminationBenefit) => {
    router.push(`/dashboard/payroll-configuration/termination-benefits/${item._id}`);
  };

  const handleEdit = (item: TerminationBenefit) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/termination-benefits/${item._id}/edit`);
    } else {
      alert('Only draft termination benefits can be edited.');
    }
  };

  const handleDelete = async (item: TerminationBenefit) => {
    if (item.status !== 'draft') {
      alert('Only draft termination benefits can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await terminationBenefitsApi.delete(item._id);
      loadTerminationBenefits(); // Refresh
    } catch (error) {
      console.error('Error deleting termination benefit:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete termination benefit');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allTerminationBenefits.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Termination Benefits</h1>
          <p className="text-gray-600 mt-1">Manage termination and resignation benefits</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Termination Benefit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['draft', 'approved', 'rejected'] as const).map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <StatusBadge status={status} size="sm" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)} Benefits</p>
                <p className="text-2xl font-bold">{getStatusCount(status)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <ConfigurationTable
            data={terminationBenefits}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={undefined}
            canDelete={() => false}
            isLoading={isLoading}
            emptyMessage="No termination benefits found. Create your first termination benefit to get started."
          />
        </div>
      </div>
    </div>
  );
}

