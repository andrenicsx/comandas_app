import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

export const getFuncionarios = async () => {
  const response = await api.get(API_ENDPOINTS.FUNCIONARIO.LIST);
  return response.data;
};

export const getFuncionarioById = async (id) => {
  const endpoint = API_ENDPOINTS.FUNCIONARIO.GET.replace(':id', id);

  const response = await api.get(endpoint);
  return response.data;
};

export const deleteFuncionario = async (id) => {
  const endpoint = API_ENDPOINTS.FUNCIONARIO.DELETE.replace(':id', id);

  const response = await api.delete(endpoint);
  return response.data;
};

export const createFuncionario = async (data) => {
  const response = await api.post(
    API_ENDPOINTS.FUNCIONARIO.CREATE,
    data
  );

  return response.data;
};

export const updateFuncionario = async (id, data) => {
  const endpoint = API_ENDPOINTS.FUNCIONARIO.UPDATE.replace(':id', id);

  const response = await api.put(endpoint, data);

  return response.data;
};

export const checkCpfExists = async (cpf) => {
  const response = await api.get(
    API_ENDPOINTS.FUNCIONARIO.LIST,
    {
      params: { cpf }
    }
  );

  return response.data.length > 0;
};