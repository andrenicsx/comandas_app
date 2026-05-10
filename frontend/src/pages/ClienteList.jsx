// useEffect executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
// useState gerenciar o estado local do componente, como a lista de clientes.
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
// useNavigate navegar entre páginas.
import { useNavigate } from 'react-router-dom';
// serviços - funções para buscar e deletar clientes
import { getClientes, deleteCliente } from '../services/clienteService';
// mensagens de sucesso, erro e confirmação
import { toast } from 'react-toastify';
// useTheme para acessar o tema do Material-UI.
import { useTheme } from '@mui/material/styles';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ClienteList() {

  // O useNavigate é um hook que permite navegar programaticamente entre as rotas da aplicação
  const navigate = useNavigate();

  // Hook para detectar o tamanho da telaAdd commentMore actions
  // theme: Obtém o tema do Material-UI.
  const theme = useTheme();
  // Aqui, estamos verificando se a tela é menor ou igual ao breakpoint 'sm' definido no tema
  // O valor 'sm' é definido no tema do Material-UI e representa um breakpoint específico (geralmente 600px)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // useState: usado para gerenciar o estado local do componente, como a lista de clientes.
  // Aqui, estamos criando um estado chamado clientes e uma função para atualizá-lo chamada setClientes.
  // O estado inicial é um array vazio, que será preenchido com os dados dos clientes após a chamada da API / Proxy/BFF.
  const [clientes, setClientes] = useState([]);

  // useEffect usado para executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
  // O array vazio [] significa que o efeito será executado apenas uma vez, quando o componente for montado.
  useEffect(() => {
    fetchClientes();
  }, []);

  // Função para buscar a lista de clientes da API / Proxy/BFF
  // getClientes: função que faz a chamada à API / Proxy/BFF para buscar os clientes.
  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // Função para lidar com o clique no botão de deletar cliente
  // handleDeleteClick: função que exibe um toast de confirmação antes de excluir o cliente.
  const handleDeleteClick = (cliente) => {
    toast(
      <div>
        <Typography>Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?</Typography>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained" color="error" size="small"
            onClick={() => handleDeleteConfirm(cliente.id_cliente)} style={{ marginRight: '10px' }}
          >Excluir</Button>
          <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
        </div>
      </div>,
      {
        position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false,
      }
    );
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteCliente(id);
      fetchClientes();
      toast.dismiss(); // Fecha o toast após a exclusão
      toast.success('Cliente excluído com sucesso!', { position: "top-center" });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast.error('Erro ao excluir cliente.', { position: "top-center" });
    }
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Clientes', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nome', 'CPF', 'Telefone']],
      body: clientes.map(c => [
        c.id_cliente,
        c.nome,
        c.cpf,
        c.telefone
      ]),
    });

    doc.save('relatorio_clientes.pdf');
  };


  return (
    <TableContainer component={Paper}>

      <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="success" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, }}>
          <PictureAsPdf fontSize="medium" /> Clientes
        </Typography>
        <Button variant="contained" color="success" onClick={() => navigate('/cliente')} startIcon={<FiberNew />}>Novo</Button>
        <Button variant="contained" color="success" startIcon={<PictureAsPdf />} onClick={handleGeneratePdf}>Gerar PDF</Button>
      </Toolbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            {/* conforme o tamanho da tela, define o que renderizar */}
            {!isSmallScreen && (
              <>
                <TableCell>Telefone</TableCell>
              </>
            )}
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id_cliente}>
              <TableCell>{cliente.id_cliente}</TableCell>
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>{cliente.cpf}</TableCell>
              {/* conforme o tamanho da tela, define o que renderizar */}
              {!isSmallScreen && (
                <>
                  <TableCell>{cliente.telefone}</TableCell>
                </>
              )}
              <TableCell>
                {/* executa a rota, passando o opr view e o id selecionado */}
                <IconButton onClick={() => navigate(`/cliente/view/${cliente.id_cliente}`)}>
                  <Visibility color="primary" />
                </IconButton>
                {/* executa a rota, passando o opr edit e o id selecionado */}
                <IconButton onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}>
                  <Edit color="secondary" />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(cliente)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  );
}
export default ClienteList;