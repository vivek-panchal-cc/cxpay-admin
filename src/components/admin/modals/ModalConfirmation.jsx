import React from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
} from "@coreui/react";

const ModalConfirmation = (props) => {
  const {
    show = false,
    title = "",
    description = "",
    labelConfirm = "Confirm",
    labelCancel = "Cancel",
    onCancelCallback = () => {},
    onConfirmCallback = () => {},
  } = props;
  return (
    <CModal show={show} onClose={onCancelCallback} color="#636f83">
      <CModalHeader closeButton>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{description}</CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={onConfirmCallback}>
          {labelConfirm}
        </CButton>
        <CButton color="secondary" onClick={onCancelCallback}>
          {labelCancel}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModalConfirmation;
