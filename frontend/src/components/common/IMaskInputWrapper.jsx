import React, { forwardRef } from "react";
import { IMaskInput } from "react-imask";

// Componente Wrapper para lidar com a ref e propriedades
const IMaskInputWrapper = forwardRef(function IMaskInputWrapper(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      // Passa a ref corretamente para o IMaskInput
      inputRef={ref}
      // Atualiza o valor no react-hook-form usando o onChange
      // O onAccept é chamado quando o valor é aceito, então chamamos o onChange com o novo valor
      onAccept={(value) => onChange({ target: { value } })}
    />
  );
});

export default IMaskInputWrapper;