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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tax rule...</p>
        </div>
      </div>
    );
  }

  if (error || !taxRule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-semibold">{error || 'Tax rule not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract createdBy name if it's an object
  const getCreatedByName = () => {
    if (!taxRule.createdBy) return 'N/A';
    if (typeof taxRule.createdBy === 'string') return taxRule.createdBy;
    if (taxRule.createdBy.firstName && taxRule.createdBy.lastName) {
      return `${taxRule.createdBy.firstName} ${taxRule.createdBy.lastName}`;
    }
    return taxRule.createdBy.email || taxRule.createdBy.fullName || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
            className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-slate-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="font-medium">Back to Tax Rules</span>
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
                  {taxRule.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={taxRule.status} />
                  <span className="text-sm text-gray-500 font-mono">ID: {taxRule._id || taxRule.id}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleEdit}
              className="group px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              {taxRule.status === 'approved' ? 'Update Tax Rule' : 'Edit Tax Rule'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Card */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tax Rule Details</h2>
              </div>
              
              <div className="space-y-6">
                {taxRule.description && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                    <p className="text-gray-800 leading-relaxed">{taxRule.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Tax Type</label>
                    <p className="text-lg font-bold text-slate-700 capitalize">
                      {taxRule.taxType ? taxRule.taxType.replace('_', ' ') : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Base Rate</label>
                    <p className="text-lg font-bold text-slate-700">{taxRule.rate}%</p>
                  </div>
                </div>
                
                {taxRule.brackets && taxRule.brackets.length > 0 && (
                  <div className="mt-6">
                    <label className="text-sm font-semibold text-gray-700 mb-4 block flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      Progressive Tax Brackets
                    </label>
                    <div className="space-y-3">
                      {taxRule.brackets.map((bracket: any, index: number) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EGP'
                              }).format(bracket.min)} - {bracket.max ? 
                                new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'EGP'
                                }).format(bracket.max) : '∞'}
                            </span>
                            <span className="px-3 py-1 bg-slate-600 text-white rounded-lg text-sm font-bold">
                              {bracket.rate}%
                            </span>
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
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Metadata</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Created By</label>
                  <p className="text-sm font-medium text-gray-900">{getCreatedByName()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Created At</label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(taxRule.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Last Updated</label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(taxRule.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

