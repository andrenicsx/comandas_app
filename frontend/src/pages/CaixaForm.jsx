import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider
} from '@mui/material';

import PageLayout from '../components/common/PageLayout';
import recebimentoService from '../services/recebimentoService';
import showSnackbar from '../utils/snackbar';
import { useAuth } from '../context/AuthContext';

const CaixaForm = () => {

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [comandas, setComandas] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  const [subtotal, setSubtotal] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [acrescimo, setAcrescimo] = useState(0);

  const [openComprovante, setOpenComprovante] = useState(false);
  const [comprovante, setComprovante] = useState(null);

  useEffect(() => {
    carregarComandas();
  }, []);

  const carregarComandas = async () => {
    try {

      setLoading(true);

      const data =
        await recebimentoService.dashboard();

      setComandas(data);

    } catch (error) {

      showSnackbar(
        error.apiMessage ||
        'Erro ao carregar comandas',
        'error'
      );

    } finally {

      setLoading(false);

    }
  };

  const selecionarComanda = (comanda) => {

    let novasSelecionadas = [];

    const existe = selecionadas.find(
      c => c.id === comanda.id
    );

    if (existe) {

      novasSelecionadas =
        selecionadas.filter(
          c => c.id !== comanda.id
        );

    } else {

      novasSelecionadas = [
        ...selecionadas,
        comanda
      ];

    }

    setSelecionadas(novasSelecionadas);

    const total = novasSelecionadas.reduce(
      (soma, item) =>
        soma + Number(item.total),
      0
    );

    setSubtotal(total);
  };

  const valorFinal =
    subtotal -
    Number(desconto || 0) +
    Number(acrescimo || 0);

  const finalizarRecebimento = async () => {

    if (selecionadas.length === 0) {

      showSnackbar(
        'Selecione ao menos uma comanda',
        'warning'
      );

      return;
    }

    try {

      const payload = {
        comandas_ids:
          selecionadas.map(
            c => c.id
          ),
        cliente_id: null,
        funcionario_id: user.id,
        desconto_valor:
          Number(desconto),
        acrescimo_valor:
          Number(acrescimo)
      };

      const recebimento =
        await recebimentoService.receber(
          payload
        );

      const dadosComprovante =
        await recebimentoService.comprovante(
          payload.comandas_ids,
          payload.desconto_valor,
          payload.acrescimo_valor
        );

      setComprovante({
        ...dadosComprovante,
        recebimento_id: recebimento.id
      });
      setOpenComprovante(true);

      showSnackbar(
        'Recebimento realizado com sucesso!',
        'success'
      );

      setSelecionadas([]);
      setSubtotal(0);
      setDesconto(0);
      setAcrescimo(0);

      carregarComandas();

    } catch (error) {

      showSnackbar(
        error.apiMessage ||
        'Erro ao realizar recebimento',
        'error'
      );

    }
  };

  if (loading) {

    return (
      <PageLayout title="Caixa">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 5
          }}
        >
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (

    <PageLayout title="Caixa">

      <Paper sx={{ p: 3, mb: 3 }}>

        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          Comandas Abertas
        </Typography>

        <Table>

          <TableHead>

            <TableRow>
              <TableCell />
              <TableCell>Comanda</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {comandas.map(comanda => (

              <TableRow key={comanda.id}>

                <TableCell>

                  <Checkbox
                    checked={
                      selecionadas.some(
                        c =>
                          c.id ===
                          comanda.id
                      )
                    }
                    onChange={() =>
                      selecionarComanda(
                        comanda
                      )
                    }
                  />

                </TableCell>

                <TableCell>
                  {comanda.comanda}
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography>
                      {comanda.cliente || '-'}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {comanda.produtos?.map(
                        p => `${p.quantidade}x ${p.nome}`
                      ).join(', ')}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  R$ {Number(
                    comanda.total
                  ).toFixed(2)}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

      <Paper sx={{ p: 3 }}>



        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          Recebimento
        </Typography>

        <TextField
          fullWidth
          label="Acréscimo"
          type="number"
          margin="normal"
          value={acrescimo}
          onChange={(e) =>
            setAcrescimo(
              e.target.value
            )
          }
        />

        <TextField
          fullWidth
          label="Desconto"
          type="number"
          margin="normal"
          value={desconto}
          onChange={(e) =>
            setDesconto(
              e.target.value
            )
          }
        />

        <Typography sx={{ mt: 2 }}>
          Subtotal:
          R$ {subtotal.toFixed(2)}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 'bold'
          }}
        >
          Valor Final:
          R$ {valorFinal.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={
            finalizarRecebimento
          }
        >
          Finalizar Recebimento
        </Button>

      </Paper>

      <Dialog
        open={openComprovante}
        onClose={() => setOpenComprovante(false)}
        maxWidth="sm"
        fullWidth
      >

        <DialogContent>

          {comprovante && (
            <>

              <Box
                sx={{
                  fontFamily: 'Courier New, monospace',
                  backgroundColor: '#F5E6A8',
                  border: '1px dashed #000000',
                  p: 3,
                  borderRadius: 1,
                  color: '#000'
                }}
              >

                <Typography
                  align="center"
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontWeight: 'bold',
                    letterSpacing: '2px'
                  }}
                >
                  CUPOM NÃO FISCAL
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}
                >
                  COMANDAS DO ZÉ
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  CNPJ: 00.000.000/0001-00
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.85rem'
                  }}
                >
                  CLIENTE: {comprovante.cliente || 'Consumidor'}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  CONTROLE Nº: {comprovante.recebimento_id}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  DATA: {new Date(comprovante.data_hora).toLocaleString()}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  CAIXA: {user?.nome}
                </Typography>


                <Box sx={{ my: 1, borderTop: '2px dashed #444' }} />



                {comprovante.comandas?.map((c, index) => (
                  <Box key={index} sx={{ mb: 1 }}>

                    <Typography
                      sx={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                      }}
                    >
                      Comanda #{c.comanda}
                    </Typography>


                    {c.produtos?.map((produto, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: 'Courier New, monospace',
                          fontSize: '0.85rem',
                          mb: 0.5
                        }}
                      >
                        <span>
                          {produto.quantidade}x {produto.nome}
                        </span>

                        <span>
                          R$ {(produto.quantidade * Number(produto.valor_unitario)).toFixed(2)}
                        </span>
                      </Box>
                    ))}
                  </Box>
                ))}



                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem'
                  }}
                >
                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    Subtotal
                  </Typography>

                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    R$ {Number(comprovante.subtotal).toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ my: 1, borderTop: '2px dashed #444' }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem'
                  }}
                >
                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    Acréscimo
                  </Typography>

                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    R$ {Number(comprovante.acrescimo).toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem'
                  }}
                >
                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    Desconto
                  </Typography>

                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    R$ {Number(comprovante.desconto).toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ my: 1, borderTop: '2px dashed #444' }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Courier New, monospace',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Courier New, monospace',
                      fontWeight: 'bold', fontSize: '0.85rem'
                    }}
                  >
                    VALOR FINAL
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: 'Courier New, monospace',
                      fontWeight: 'bold', fontSize: '0.85rem'
                    }}
                  >
                    R$ {Number(comprovante.valor_final).toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    my: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem'
                  }}
                >
                  <Typography sx={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>
                    Obrigado pela preferência, Volte sempre!
                  </Typography>

                </Box>
              </Box>


              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => window.print()}
              >
                Imprimir
              </Button>

            </>

          )}

        </DialogContent>

      </Dialog>

    </PageLayout>
  );
};

export default CaixaForm;