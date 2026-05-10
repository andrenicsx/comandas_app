// useEffect executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
// useState gerenciar o estado local do componente, como a lista de funcionários.
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
// useNavigate navegar entre páginas.
import { useNavigate } from 'react-router-dom';
// serviços - funções para buscar e deletar funcionários
import { getFuncionarios, deleteFuncionario } from '../services/funcionarioService';
// mensagens de sucesso, erro e confirmação
import { toast } from 'react-toastify';
// useTheme para acessar o tema do Material-UI.
import { useTheme } from '@mui/material/styles';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function FuncionarioList() {

  // O useNavigate é um hook que permite navegar programaticamente entre as rotas da aplicação
  const navigate = useNavigate();

  // Hook para detectar o tamanho da tela
  // theme: Obtém o tema do Material-UI.
  const theme = useTheme();
  // Aqui, estamos verificando se a tela é menor ou igual ao breakpoint 'sm' definido no tema
  // O valor 'sm' é definido no tema do Material-UI e representa um breakpoint específico (geralmente 600px)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // useState: usado para gerenciar o estado local do componente, como a lista de funcionários.
  // Aqui, estamos criando um estado chamado funcionarios e uma função para atualizá-lo chamada setFuncionarios.
  // O estado inicial é um array vazio, que será preenchido com os dados dos funcionários após a chamada da API / Proxy/BFF.
  const [funcionarios, setFuncionarios] = useState([]);

  // useEffect usado para executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
  // O array vazio [] significa que o efeito será executado apenas uma vez, quando o componente for montado.
  useEffect(() => {
    fetchFuncionarios();
  }, []);

  // Função para buscar a lista de funcionários da API / Proxy/BFF
  // getFuncionarios: função que faz a chamada à API / Proxy/BFF para buscar os funcionários.
  const fetchFuncionarios = async () => {
    try {
      const data = await getFuncionarios();
      setFuncionarios(data);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  // Função para lidar com o clique no botão de deletar funcionário
  // handleDeleteClick: função que exibe um toast de confirmação antes de excluir o funcionário.
  const handleDeleteClick = (funcionario) => {
    toast(
      <div>
        <Typography>Tem certeza que deseja excluir o funcionário <strong>{funcionario.nome}</strong>?</Typography>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained" color="error" size="small"
            onClick={() => handleDeleteConfirm(funcionario.id_funcionario)} style={{ marginRight: '10px' }}
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
      await deleteFuncionario(id);
      fetchFuncionarios();
      toast.dismiss(); // Fecha o toast após a exclusão
      toast.success('Funcionário excluído com sucesso!', { position: "top-center" });
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      toast.error('Erro ao excluir funcionário.', { position: "top-center" });
    }
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Funcionários', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nome', 'CPF', 'Matrícula', 'Telefone', 'Grupo']],
      body: funcionarios.map(f => [
        f.id_funcionario,
        f.nome,
        f.cpf,
        f.matricula,
        f.telefone,
        f.grupo
      ]),
    });

    doc.save('relatorio_funcionarios.pdf');
  };

  return (
    <TableContainer component={Paper}>

      <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="success" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, }}>
          <PictureAsPdf fontSize="medium" /> Funcionários
        </Typography>
        <Button variant="contained" color="success" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>Novo</Button>
        <Button variant="contained" color="success" startIcon={<PictureAsPdf />} onClick={handleGeneratePdf}>Gerar PDF</Button>
      </Toolbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome de André</TableCell>
            <TableCell>CPF</TableCell>
            {/* conforme o tamanho da tela, define o que renderizar */}
            {!isSmallScreen && (
              <>
                <TableCell>Matrícula</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Grupo</TableCell>
              </>
            )}
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {funcionarios.map((funcionario) => (
            <TableRow key={funcionario.id_funcionario}>
              <TableCell>{funcionario.id_funcionario}</TableCell>
              <TableCell>{funcionario.nome}</TableCell>
              <TableCell>{funcionario.cpf}</TableCell>
              {/* conforme o tamanho da tela, define o que renderizar */}
              {!isSmallScreen && (
                <>
                  <TableCell>{funcionario.matricula}</TableCell>
                  <TableCell>{funcionario.telefone}</TableCell>
                  <TableCell>{funcionario.grupo}</TableCell>
                </>
              )}
              <TableCell>
                {/* executa a rota, passando o opr view e o id selecionado */}
                <IconButton onClick={() => navigate(`/funcionario/view/${funcionario.id_funcionario}`)}>
                  <Visibility color="primary" />
                </IconButton>
                {/* executa a rota, passando o opr edit e o id selecionado */}
                <IconButton onClick={() => navigate(`/funcionario/edit/${funcionario.id_funcionario}`)}>
                  <Edit color="secondary" />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(funcionario)}>
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
export default FuncionarioList;