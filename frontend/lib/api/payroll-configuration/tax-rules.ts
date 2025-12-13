import apiClient from '../client';
import { TaxRule, CreateTaxRuleDto, UpdateTaxRuleDto } from './types';

const BASE_URL = '/payroll-configuration/tax-rules';

export const getTaxRules = async (params?: { status?: string }): Promise<TaxRule[]> => {
  const response = await apiClient.get(BASE_URL, { params });
  return response.data;
};

export const getTaxRuleById = async (id: string): Promise<TaxRule> => {
  const response = await apiClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createTaxRule = async (data: CreateTaxRuleDto): Promise<TaxRule> => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

export const updateTaxRule = async (id: string, data: UpdateTaxRuleDto): Promise<TaxRule> => {
  const response = await apiClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteTaxRule = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};