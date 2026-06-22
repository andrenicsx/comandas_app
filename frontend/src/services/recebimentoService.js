import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const { RECEBIMENTO } = API_ENDPOINTS;

const recebimentoService = {

  // Dashboard de comandas abertas
  dashboard: async () => {
    const response = await api.get(
      RECEBIMENTO.DASHBOARD
    );

    return response.data;
  },

  // Detalhar comandas selecionadas
  detalharComandas: async (comandasIds) => {

    const comandas = comandasIds.join(',');

    const response = await api.get(
      `${RECEBIMENTO.DETALHE}?comandas=${comandas}`
    );

    return response.data;
  },

  // Realizar recebimento
  receber: async (recebimentoData) => {

    const response = await api.post(
      RECEBIMENTO.RECEBER,
      recebimentoData
    );

    return response.data;
  },

  // Gerar comprovante
  comprovante: async (
    comandasIds,
    desconto = 0,
    acrescimo = 0
  ) => {

    const comandas = comandasIds.join(',');

    const response = await api.get(
      `${RECEBIMENTO.COMPROVANTE}?comandas=${comandas}&desconto=${desconto}&acrescimo=${acrescimo}`
    );

    return response.data;
  }

};

export default recebimentoService;