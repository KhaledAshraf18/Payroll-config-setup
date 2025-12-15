'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { signingBonusesApi } from '@/lib/api/payroll-configuration/signing-bonuses';
import { SigningBonus } from '@/lib/api/payroll-configuration/types';

export default function SigningBonusesPage() {
  // Only Payroll Specialist can create/edit signing bonuses
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  
  const router = useRouter();
  const [signingBonuses, setSigningBonuses] = useState<SigningBonus[]>([]);
  const [allSigningBonuses, setAllSigningBonuses] = useState<SigningBonus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadSigningBonuses();
  }, [statusFilter]);

  const loadSigningBonuses = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await signingBonusesApi.getAll(status);
      setAllSigningBonuses(data);
      setSigningBonuses(data);
    } catch (error) {
      console.error('Error loading signing bonuses:', error);
      setSigningBonuses([]);
      setAllSigningBonuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'positionName', 
      label: 'Position Name',
      render: (item: SigningBonus) => (
        <div className="font-medium text-gray-900">{(item as any).positionName || item.name || 'N/A'}</div>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (item: SigningBonus) => (
        <div className="font-medium text-gray-900">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP'
          }).format(item.amount)}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: SigningBonus) => <StatusBadge status={item.status} />
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/signing-bonuses/new');
  };

  const handleView = (item: SigningBonus) => {
    router.push(`/dashboard/payroll-configuration/signing-bonuses/${item._id}`);
  };

  const handleEdit = (item: SigningBonus) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/signing-bonuses/${item._id}/edit`);
    } else {
      alert('Only draft signing bonuses can be edited.');
    }
  };

  const handleDelete = async (item: SigningBonus) => {
    if (item.status !== 'draft') {
      alert('Only draft signing bonuses can be deleted.');
      return;
    }

    const positionName = (item as any).positionName || item.name || 'this signing bonus';
    if (!confirm(`Are you sure you want to delete "${positionName}"?`)) {
      return;
    }

    try {
      await signingBonusesApi.delete(item._id);
      loadSigningBonuses(); // Refresh
    } catch (error) {
      console.error('Error deleting signing bonus:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete signing bonus');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allSigningBonuses.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Signing Bonuses</h1>
          <p className="text-gray-600 mt-1">Manage signing bonus configurations for new employees</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Signing Bonus
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['draft', 'approved', 'rejected'] as const).map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <StatusBadge status={status} size="sm" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)} Bonuses</p>
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
            data={signingBonuses}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={undefined}
            canDelete={() => false}
            isLoading={isLoading}
            emptyMessage="No signing bonuses found. Create your first signing bonus to get started."
          />
        </div>
      </div>
    </div>
  );
}

