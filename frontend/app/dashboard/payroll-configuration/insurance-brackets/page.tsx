'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';
import { InsuranceBracket } from '@/lib/api/payroll-configuration/types';

export default function InsuranceBracketsPage() {
  // Only Payroll Specialist can create/edit insurance brackets
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  
  const router = useRouter();
  const [insuranceBrackets, setInsuranceBrackets] = useState<InsuranceBracket[]>([]);
  const [allInsuranceBrackets, setAllInsuranceBrackets] = useState<InsuranceBracket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadInsuranceBrackets();
  }, [statusFilter]);

  const loadInsuranceBrackets = async () => {
    setIsLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const data = await insuranceBracketsApi.getAll(params);
      setAllInsuranceBrackets(data);
      setInsuranceBrackets(data);
    } catch (error) {
      console.error('Error loading insurance brackets:', error);
      setInsuranceBrackets([]);
      setAllInsuranceBrackets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'salaryRange', 
      label: 'Salary Range',
      render: (item: InsuranceBracket) => (
        <div>
          <div className="font-medium text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EGP'
            }).format(item.minSalary)} - {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EGP'
            }).format(item.maxSalary)}
          </div>
        </div>
      )
    },
    { 
      key: 'employeeContribution', 
      label: 'Employee Contribution',
      render: (item: InsuranceBracket) => (
        <div className="font-medium text-gray-900">{item.employeeContribution}%</div>
      )
    },
    { 
      key: 'employerContribution', 
      label: 'Employer Contribution',
      render: (item: InsuranceBracket) => (
        <div className="font-medium text-gray-900">{item.employerContribution}%</div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: InsuranceBracket) => <StatusBadge status={item.status} />
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/insurance-brackets/new');
  };

  const handleView = (item: InsuranceBracket) => {
    router.push(`/dashboard/payroll-configuration/insurance-brackets/${item._id}`);
  };

  const handleEdit = (item: InsuranceBracket) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/insurance-brackets/${item._id}/edit`);
    } else {
      alert('Only draft insurance brackets can be edited.');
    }
  };

  const handleDelete = async (item: InsuranceBracket) => {
    if (item.status !== 'draft') {
      alert('Only draft insurance brackets can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete this insurance bracket?`)) {
      return;
    }

    try {
      await insuranceBracketsApi.delete(item._id);
      loadInsuranceBrackets(); // Refresh
    } catch (error) {
      console.error('Error deleting insurance bracket:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete insurance bracket');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allInsuranceBrackets.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insurance Brackets</h1>
          <p className="text-gray-600 mt-1">Manage insurance contribution brackets</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Insurance Bracket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['draft', 'approved', 'rejected'] as const).map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <StatusBadge status={status} size="sm" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)} Brackets</p>
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
            data={insuranceBrackets}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage="No insurance brackets found. Create your first insurance bracket to get started."
          />
        </div>
      </div>
    </div>
  );
}

