import Modal from "react-modal";
import ServiceItemPopup from "./popups/ServiceItemPopup";
import CategoryPopup from "./popups/CategoryPopup";
import InquiryPopup from "./popups/InquiryPopup";

const DetailsDialog = ({ isOpen, handleCloseModal, modalState }) => {
  const { type, selectedItem } = modalState;

  console.log(modalState);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
      contentLabel="Service Description"
      className="m-10 bg-white p-16 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out w-3/4 max-w-3xl max-h-[80vh] overflow-y-auto flex flex-col items-center"
      overlayClassName="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black backdrop-blur-xs"
    >
      {type == "category" ? (
        <CategoryPopup selectedItem={selectedItem} />
      ) : (
        // <ServiceItemPopup selectedItem={selectedItem} />
        <InquiryPopup inquiry={selectedItem} />
      )}
    </Modal>
  );
};

export default DetailsDialog;
