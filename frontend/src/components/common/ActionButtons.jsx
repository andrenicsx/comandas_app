import { Box, IconButton } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const ActionButtons = ({
  item,
  onView,
  onEdit,
  onDelete,
  children
}) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    {onView && (
      <IconButton
        size="small"
        color="primary"
        title="Visualizar"
        onClick={() => onView(item)}
      >
        <Visibility fontSize="small" />
      </IconButton>
    )}

    {onEdit && (
      <IconButton
        size="small"
        color="secondary"
        title="Editar"
        onClick={() => onEdit(item)}
      >
        <Edit fontSize="small" />
      </IconButton>
    )}

    {onDelete && (
      <IconButton
        size="small"
        color="error"
        title="Excluir"
        onClick={() => onDelete(item)}
      >
        <Delete fontSize="small" />
      </IconButton>
    )}
    {children}
  </Box>
);

export default ActionButtons;