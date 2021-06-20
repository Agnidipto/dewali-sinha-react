import React, { useState, useEffect } from "react";
import { Modal, Button } from "semantic-ui-react";
import refreshToken from "../AppService";
import ErrorFunction from "../ErrorFunction";
import SecondaryErrorModal from "./SecondaryErrorModal";

function ErrorModal(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const message = props.message;
  const onClose = props.onClose;
  const [secondaryError, setSecondaryError] = React.useState({
    open: false,
    message: null,
  });

  const [refreshMessage, setRefreshMessage] = React.useState(false);

  useEffect(() => {
    check();
  }, [props.open]);

  function check() {
    if (message === "Access is denied") {
      console.log("denied");
      if (localStorage.getItem("token")) setRefreshMessage(true);
    }
  }

  function refreshTokenFunction(e) {
    refreshToken()
      .then((res) => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      })
      .catch((err) => setSecondaryError(ErrorFunction(err)));
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          if (onClose) onClose();
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
          {refreshMessage && (
            <Button primary onClick={refreshTokenFunction}>
              Refresh Token
            </Button>
          )}
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
      <SecondaryErrorModal
        open={secondaryError.open}
        message={secondaryError.message}
        setOpen={setSecondaryError}
      />
    </>
  );
}

export default ErrorModal;
