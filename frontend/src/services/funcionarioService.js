export const getFuncionarios = async () => {
  return [];
};

export const getFuncionarioById = async (id) => {
  return {
    id_funcionario: id,
    nome: "André",
    cpf: "12345678902",
    matricula: "001",
    telefone: "49999999999",
    senha: "123456",
    grupo: "1"
  };
};

export const deleteFuncionario = async () => {
  return true;
};

export const createFuncionario = async (data) => {
  return { id: 1 };
};

export const updateFuncionario = async (id, data) => {
  return { id };
};

export const checkCpfExists = async () => {
  return {
    exists: false
  };
};