import api from '../client';
import { TaxRule, CreateTaxRuleDto, UpdateTaxRuleDto } from './types';

const BASE_URL = '/payroll-configuration/tax-rules';

export const taxRulesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<TaxRule[]> => {
    try {
      const params = status ? { status } : undefined;
      const response = await api.get(BASE_URL, params ? { params } : {});
      let rules = Array.isArray(response) ? response : response?.data || response?.items || [];
      return rules;
    } catch (error) {
      console.error('Error fetching tax rules:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<TaxRule> => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Error fetching tax rule ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateTaxRuleDto): Promise<TaxRule> => {
    try {
      const response = await api.post(BASE_URL, data);
      return response?.data || response;
    } catch (error) {
      console.error('Error creating tax rule:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateTaxRuleDto): Promise<TaxRule> => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error(`Error updating tax rule ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting tax rule ${id}:`, error);
      throw error;
    }
  },
};

// Export individual functions for backward compatibility
export const getTaxRules = taxRulesApi.getAll;
export const getTaxRuleById = taxRulesApi.getById;
export const createTaxRule = taxRulesApi.create;
export const updateTaxRule = taxRulesApi.update;
export const deleteTaxRule = taxRulesApi.delete;