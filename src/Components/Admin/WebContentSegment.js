import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import { postWebContent, deleteWebContent } from "./adminService";
import ErrorFunction from "../ErrorFunction";
import { Segment, Icon, Modal, Button, Form } from "semantic-ui-react";

import Expand from "react-expand-animated";

function WebContentSegment(props) {
  const [webContent, setWebContent] = useState(props.webContent);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState({
    open: false,
    message: null,
  });

  const [show, setShow] = useState(false);
  const styles = { marginBottom: "15px" };
  const transitions = ["height", "opacity"];

  const segmentStyle = {
    width: "95%",
    margin: "auto auto 10px",
  };

  function deleteWebContentFunction() {
    deleteWebContent(webContent.contentId)
      .then((res) => {
        console.log(res.data);
        props.history.push("/admin");
      })
      .catch((err) => setError(ErrorFunction(err)));
  }
  return (
    <>
      <Segment inverted className='segment-border' style={segmentStyle}>
        <h3
          onClick={() => setShow(!show)}
          style={{
            width: "calc(100% - 30px)",
            backgroundColor: "#00b5ad",

            display: "inline-block",
            margin: 0,
            paddingTop: "3px",
            height: "30px",
            borderRadius: ".28571429rem",
          }}
        >
          {webContent.name} <Icon name={show ? "caret up" : "caret down"} />
        </h3>
        <Button
          icon
          size='small'
          circular
          floated='right'
          color='red'
          style={{
            padding: 5,
            marginTop: 3,
          }}
          onClick={deleteWebContentFunction}
        >
          <Icon name='delete' fitted style={{ height: 13, width: 13 }} />
        </Button>
        <Expand styles={styles} transitions={transitions} open={show}>
          <p style={{ marginTop: 10 }}>{webContent.content}</p>
          <p
            style={{
              cursor: "pointer",
              color: "#00b5ad",
              display: "inline-block",
            }}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </p>
        </Expand>
      </Segment>
      <WebContentModal
        open={editOpen}
        setOpen={setEditOpen}
        text={webContent.content}
        name={webContent.name}
        heading={webContent.heading}
        refresh={props.refresh}
      />
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
    </>
  );
}

export default withRouter(WebContentSegment);

function WebContentModal(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const [error, setError] = React.useState({
    open: false,
    message: null,
  });

  const [loading, setLoading] = useState(false);

  const [length, setLength] = useState(2000 - props.text.length);

  const [text, setText] = useState(props.text ? props.text : "");

  const [textError, setTextError] = useState(false);

  function onChange(e, { value }) {
    if (value.length <= 2000) setText(value);
    setLength(2000 - value.length);
  }

  function post() {
    if (text.length > 0 && text.length <= 2000) {
      setLoading(true);
      postWebContent(props.name, props.heading, text)
        .then((res) => {
          props.refresh();
          setOpen(false);
        })
        .catch((err) => setError(ErrorFunction(err)));
    } else
      setTextError("Please enter valid Content between 0 - 2000 characters");
  }
  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setText(props.text);
          setLoading(false);
          setTextError(false);
          setOpen(false);
        }}
        size='tiny'
        dimmer={true}
      >
        <Modal.Header className='modal-header'>
          <h3 className='teal-text'>Content for {props.name}</h3>
        </Modal.Header>
        <Modal.Content className='modal-content'>
          <Form>
            <p>Heading: {props.heading}</p>
            <p>Name: {props.name}</p>
            <p style={{ textAlign: "right", marginTop: 0 }}>{length}</p>
            <Form.TextArea
              name='text'
              value={text}
              onChange={onChange}
              rows={4}
              fluid
              placeholder='Content'
              error={textError}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions className='modal-content'>
          <Button
            color='red'
            loading={loading}
            onClick={() => {
              setText(props.text);
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
