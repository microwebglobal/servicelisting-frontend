import { useState } from "react";

export const useModal = () => {
  const [modalState, setModalState] = useState({
    type: null,
    selectedItem: null,
  });
  const handleModal = {
    open: (type, selectedItem = null) => {
      setModalState({ type, selectedItem });
    },
    close: () => {
      setModalState({ type: null, item: null });
    },
  };

  return { modalState, handleModal };
};
