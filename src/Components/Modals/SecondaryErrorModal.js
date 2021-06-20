import React from "react";
import { Modal, Button } from "semantic-ui-react";
import refreshToken from "../AppService";
import ErrorFunction from "../ErrorFunction";

function SecondaryErrorModal(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const message = props.message;
  const onClose = props.onClose;

  return (
    <Modal
      open={open}
      onClose={() => {
        if (onClose !== null) onClose();
        setOpen({ open: false, message: null });
      }}
      size='tiny'
      dimmer={true}
    >
      <Modal.Header className='modal-header'>
        <h3 className='teal-text'>An Error occured!</h3>
      </Modal.Header>
      <Modal.Content className='modal-content'>
        <p>{message ? message : "Please try again later!"} </p>
      </Modal.Content>
      <Modal.Actions className='modal-content'>
        <Button
          color='teal'
          onClick={() => {
            if (onClose) onClose();
            setOpen({ open: false, message: null });
          }}
        >
          Okay
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default SecondaryErrorModal;
