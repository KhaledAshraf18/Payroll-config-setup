'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth, useAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';

export default function TaxRulesPage() {
  // Allow view access for multiple roles, but only Legal Admin can create/edit
  useRequireAuth(
    [
      SystemRole.LEGAL_POLICY_ADMIN,
      SystemRole.PAYROLL_SPECIALIST,
      SystemRole.PAYROLL_MANAGER,
      SystemRole.SYSTEM_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.HR_ADMIN,
      SystemRole.DEPARTMENT_EMPLOYEE,
      SystemRole.DEPARTMENT_HEAD,
    ],
    '/dashboard'
  );
  
  const { user } = useAuth();
  const isLegalAdmin = user?.roles?.some(role => 
    String(role).toLowerCase() === String(SystemRole.LEGAL_POLICY_ADMIN).toLowerCase()
  );
  
  const router = useRouter();
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [allTaxRules, setAllTaxRules] = useState<TaxRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTaxRules();
  }, [statusFilter]);

  const loadTaxRules = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await taxRulesApi.getAll(status);
      setAllTaxRules(data);
      setTaxRules(data);
    } catch (error) {
      console.error('Error loading tax rules:', error);
      setTaxRules([]);
      setAllTaxRules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Tax Rule Name',
      render: (item: TaxRule) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
      )
    },
    { 
      key: 'taxType', 
      label: 'Tax Type',
      render: (item: TaxRule) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.taxType === 'income' ? 'bg-blue-100 text-blue-800' :
          item.taxType === 'social_security' ? 'bg-green-100 text-green-800' :
          item.taxType === 'health' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.taxType ? String(item.taxType).replace('_', ' ') : 'Unknown'}
        </span>
      )
    },
    { 
      key: 'rate', 
      label: 'Rate',
      render: (item: TaxRule) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.rate}%
          </div>
          {item.brackets && item.brackets.length > 0 && (
            <div className="text-xs text-gray-500">
              {item.brackets.length} bracket(s)
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: TaxRule) => <StatusBadge status={item.status} />
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/tax-rules/new');
  };

  const handleView = (item: TaxRule) => {
    router.push(`/dashboard/payroll-configuration/tax-rules/${item._id}`);
  };

  const handleEdit = (item: TaxRule) => {
    // Only Legal Admin can edit
    if (!isLegalAdmin) {
      alert('Only Legal Admin can edit tax rules.');
      return;
    }
    // Tax rules can be edited even if approved (they go back to draft)
    router.push(`/dashboard/payroll-configuration/tax-rules/${item._id}/edit`);
  };

  const handleDelete = async (item: TaxRule) => {
    // Only Legal Admin can delete
    if (!isLegalAdmin) {
      alert('Only Legal Admin can delete tax rules.');
      return;
    }
    
    if (item.status !== 'draft') {
      alert('Only draft tax rules can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await taxRulesApi.delete(item._id);
      loadTaxRules(); // Refresh
    } catch (error) {
      console.error('Error deleting tax rule:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete tax rule');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allTaxRules.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Rules</h1>
          <p className="text-gray-600 mt-1">
            {isLegalAdmin ? 'Manage tax rules and rates' : 'View tax rules and rates (Read-only)'}
          </p>
        </div>
        {isLegalAdmin && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create New Tax Rule
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['draft', 'approved', 'rejected'] as const).map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <StatusBadge status={status} size="sm" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)} Rules</p>
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
            data={taxRules}
            columns={columns}
            onView={handleView}
            onEdit={isLegalAdmin ? handleEdit : undefined}
            onDelete={isLegalAdmin ? handleDelete : undefined}
            canEdit={isLegalAdmin ? () => true : () => false}
            canDelete={isLegalAdmin ? (item) => item.status === 'draft' : () => false}
            isLoading={isLoading}
            emptyMessage="No tax rules found."
          />
        </div>
      </div>
    </div>
  );
}

