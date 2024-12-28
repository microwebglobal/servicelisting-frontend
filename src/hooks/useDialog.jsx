import { useState } from 'react';

export const useDialog = () => {
  const [dialogState, setDialogState] = useState({ type: null, mode: null, item: null });

  const handleDialog = {
    open: (type, mode, item = null) => {
      setDialogState({ type, mode, item });
    },
    close: () => {
      setDialogState({ type: null, mode: null, item: null });
    }
  };

  return { dialogState, handleDialog };
};