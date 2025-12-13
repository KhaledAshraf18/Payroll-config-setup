import api from '../client';
import { TerminationBenefit, CreateTerminationBenefitDto, UpdateTerminationBenefitDto } from './types';

const BASE_URL = '/payroll-configuration/termination-benefits';

export const terminationBenefitsApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<TerminationBenefit[]> => {
    try {
      const params = status ? { status } : undefined;
      const response = await api.get(BASE_URL, params ? { params } : {});
      let benefits = Array.isArray(response) ? response : response?.data || response?.items || [];
      return benefits;
    } catch (error) {
      console.error('Error fetching termination benefits:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<TerminationBenefit> => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Error fetching termination benefit ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateTerminationBenefitDto): Promise<TerminationBenefit> => {
    try {
      const response = await api.post(BASE_URL, data);
      return response?.data || response;
    } catch (error) {
      console.error('Error creating termination benefit:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateTerminationBenefitDto): Promise<TerminationBenefit> => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error(`Error updating termination benefit ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting termination benefit ${id}:`, error);
      throw error;
    }
  },
};

// Export individual functions for backward compatibility
export const getTerminationBenefits = terminationBenefitsApi.getAll;
export const getTerminationBenefitById = terminationBenefitsApi.getById;
export const createTerminationBenefit = terminationBenefitsApi.create;
export const updateTerminationBenefit = terminationBenefitsApi.update;
export const deleteTerminationBenefit = terminationBenefitsApi.delete;
