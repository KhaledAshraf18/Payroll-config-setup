import api from '../client';
import { SigningBonus, CreateSigningBonusDto, UpdateSigningBonusDto } from './types';

const BASE_URL = '/payroll-configuration/signing-bonuses';

export const signingBonusesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<SigningBonus[]> => {
    try {
      const params = status ? { status } : undefined;
      const response = await api.get(BASE_URL, params ? { params } : {});
      let bonuses = Array.isArray(response) ? response : response?.data || response?.items || [];
      return bonuses;
    } catch (error) {
      console.error('Error fetching signing bonuses:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<SigningBonus> => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Error fetching signing bonus ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateSigningBonusDto): Promise<SigningBonus> => {
    try {
      const response = await api.post(BASE_URL, data);
      return response?.data || response;
    } catch (error) {
      console.error('Error creating signing bonus:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateSigningBonusDto): Promise<SigningBonus> => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response?.data || response;
    } catch (error) {
      console.error(`Error updating signing bonus ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting signing bonus ${id}:`, error);
      throw error;
    }
  },
};

// Export individual functions for backward compatibility
export const getSigningBonuses = signingBonusesApi.getAll;
export const getSigningBonusById = signingBonusesApi.getById;
export const createSigningBonus = signingBonusesApi.create;
export const updateSigningBonus = signingBonusesApi.update;
export const deleteSigningBonus = signingBonusesApi.delete;