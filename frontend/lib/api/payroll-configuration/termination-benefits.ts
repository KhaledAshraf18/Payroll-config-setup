import apiClient from '../client';
import { TerminationBenefit, CreateTerminationBenefitDto, UpdateTerminationBenefitDto } from './types';

const BASE_URL = '/payroll-configuration/termination-benefits';

export const getTerminationBenefits = async (params?: { status?: string }): Promise<TerminationBenefit[]> => {
  const response = await apiClient.get(BASE_URL, { params });
  return response.data;
};

export const getTerminationBenefitById = async (id: string): Promise<TerminationBenefit> => {
  const response = await apiClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createTerminationBenefit = async (data: CreateTerminationBenefitDto): Promise<TerminationBenefit> => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

export const updateTerminationBenefit = async (id: string, data: UpdateTerminationBenefitDto): Promise<TerminationBenefit> => {
  const response = await apiClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteTerminationBenefit = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};
