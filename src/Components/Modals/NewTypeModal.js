import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form } from "semantic-ui-react";
import refreshToken from "../AppService";
import ErrorFunction from "../ErrorFunction";
import ErrorModal from "./ErrorModal";
import CreateNewType from "./ModalService";

function NewTypeModal(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const [error, setError] = React.useState({
    open: false,
    message: null,
  });

  const [loading, setLoading] = useState(false);

  const [typeText, setTypeText] = useState("");

  const [textError, setTextError] = useState(false);

  function onChange(e, { value }) {
    setTypeText(value);
  }

  function post() {
    if (typeText.length > 0) {
      setLoading(true);
      CreateNewType(typeText)
        .then((res) => {
          console.log(res.data);
          setLoading(false);
          setOpen(false);
        })
        .catch((err) => {
          setError(ErrorFunction(err));
          setLoading(false);
        });
    } else setTextError("Please enter a valid Type");
  }
  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        size='tiny'
        dimmer={true}
      >
        <Modal.Header className='modal-header'>
          <h3 className='teal-text'>Create New Type</h3>
        </Modal.Header>
        <Modal.Content className='modal-content'>
          <Form>
            <Form.Input
              name='type'
              value={typeText}
              onChange={onChange}
              fluid
              placeholder='Name of New Type'
              error={textError}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions className='modal-content'>
          <Button
            color='red'
            loading={loading}
            onClick={() => {
              setTypeText("");
              setLoading(false);
              setTextError(false);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button color='teal' loading={loading} onClick={post}>
            Post
          </Button>
        </Modal.Actions>
      </Modal>
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
    </>
  );
}

export default NewTypeModal;
