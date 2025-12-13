import api from '../client';
import { InsuranceBracket, CreateInsuranceBracketDto, UpdateInsuranceBracketDto, ApprovalDto, RejectionDto } from './types';

const BASE_URL = '/payroll-configuration/insurance-brackets';

export const insuranceBracketsApi = {
  getAll: async (params?: { status?: string }): Promise<InsuranceBracket[]> => {
    try {
      const response = await api.get(BASE_URL, params ? { params } : {});
      let brackets = Array.isArray(response) ? response : response?.data || response?.items || [];
      return brackets;
    } catch (error) {
      console.error('Error fetching insurance brackets:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<InsuranceBracket> => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Error fetching insurance bracket ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateInsuranceBracketDto): Promise<InsuranceBracket> => {
    try {
      const response = await api.post(BASE_URL, data);
      return response?.data || response;
    } catch (error) {
      console.error('Error creating insurance bracket:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateInsuranceBracketDto): Promise<InsuranceBracket> => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error(`Error updating insurance bracket ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting insurance bracket ${id}:`, error);
      throw error;
    }
  },

  approve: async (id: string, data?: ApprovalDto): Promise<void> => {
    try {
      await api.post(`${BASE_URL}/${id}/approve`, data || {});
    } catch (error) {
      console.error(`Error approving insurance bracket ${id}:`, error);
      throw error;
    }
  },

  reject: async (id: string, data: RejectionDto): Promise<void> => {
    try {
      await api.post(`${BASE_URL}/${id}/reject`, data);
    } catch (error) {
      console.error(`Error rejecting insurance bracket ${id}:`, error);
      throw error;
    }
  },
};

// Export individual functions for backward compatibility
export const getInsuranceBrackets = insuranceBracketsApi.getAll;
export const getInsuranceBracketById = insuranceBracketsApi.getById;
export const createInsuranceBracket = insuranceBracketsApi.create;
export const updateInsuranceBracket = insuranceBracketsApi.update;
export const deleteInsuranceBracket = insuranceBracketsApi.delete;