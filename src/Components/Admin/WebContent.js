import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import {
  getWebContentByHeading,
  getWebContentHeadings,
  postWebContent,
} from "./adminService";
import ErrorFunction from "../ErrorFunction";
import { Segment, Modal, Form, Button } from "semantic-ui-react";
import WebContentSegment from "./WebContentSegment";

function WebContent(props) {
  const [error, setError] = useState({ open: false, message: null });
  const [webContents, setWebContents] = useState({});
  const [webContentHeadings, setWebContentHeadings] = useState([]);
  const segmentStyle = {
    width: "95%",
    margin: "auto auto 20px",
  };

  const [newContent, setNewContent] = useState(false);
  const [header, setHeader] = useState("");

  useEffect(() => {
    getWebContentHeadings()
      .then((res) => {
        setWebContentHeadings(res.data);
        var object = {};
        res.data.forEach((data) => {
          getWebContentByHeading(data)
            .then((res) => {
              object = { ...object, [data]: res.data };
              setWebContents(object);
            })
            .catch((err) => setError(ErrorFunction(err)));
        });
      })
      .catch((err) => setError(ErrorFunction(err)));
  }, []);

  function refresh() {
    getWebContentHeadings()
      .then((res) => {
        setWebContentHeadings(res.data);
        var object = {};
        res.data.forEach((data) => {
          getWebContentByHeading(data)
            .then((res) => {
              object = { ...object, [data]: res.data };
              setWebContents(object);
            })
            .catch((err) => setError(ErrorFunction(err)));
        });
      })
      .catch((err) => setError(ErrorFunction(err)));
  }

  return (
    <>
      <div style={{ padding: "20px 0", background: "black", height: "100%" }}>
        <Segment inverted style={segmentStyle} className='segment-border'>
          <Button
            fluid
            color='teal'
            onClick={() => {
              setHeader("");
              setNewContent(true);
            }}
          >
            New Web Content
          </Button>
        </Segment>
        {webContentHeadings.map((headings) => (
          <Segment inverted style={segmentStyle} className='segment-border'>
            <h2>{headings}</h2>
            {webContents[headings] &&
              webContents[headings].map((webContent) => (
                <WebContentSegment webContent={webContent} refresh={refresh} />
              ))}

            <Button
              color='teal'
              onClick={() => {
                setHeader(headings);
                setNewContent(true);
              }}
            >
              New Web Content
            </Button>
          </Segment>
        ))}
      </div>
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
      <NewWebContent
        open={newContent}
        setOpen={setNewContent}
        heading={header}
      />
    </>
  );
}

export default withRouter(WebContent);

function NewWebContent(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const [error, setError] = React.useState({
    open: false,
    message: null,
  });

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [heading, setHeading] = useState(props.heading);
  const [content, setContent] = useState("");

  useEffect(() => {
    setHeading(props.heading);
  }, [props.heading]);

  const [contentError, setContentError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [headingError, setHeadingError] = useState(false);

  function onContentChange(e, { value }) {
    setContent(value);
  }

  function onNameChange(e, { value }) {
    setName(value);
  }

  function onHeadingChange(e, { value }) {
    setHeading(value);
  }

  function checkError() {
    var flag = 0;
    if (content.length < 1 && content.length >= 2000) {
      setContentError(
        "Please enter valid content between 0 to 2000 characters!"
      );
      flag = 1;
    }
    if (name.length < 1) {
      setNameError("Please enter a valid name!");
      flag = 1;
    }
    if (heading.length < 1) {
      setHeadingError("Please enter a valid heading!");
      flag = 1;
    }
    return flag;
  }

  function post() {
    const errors = checkError();
    if (errors === 0) {
      setLoading(true);
      postWebContent(name, heading, content)
        .then((res) => {
          console.log(res.data);
          setOpen(false);
        })
        .catch((err) => setError(ErrorFunction(err)));
    }
  }
  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setName("");
          setHeading(props.heading);
          setContent("");
          setLoading(false);
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
            <Form.Input
              name='heading'
              placeholder='Heading'
              value={heading}
              onChange={onHeadingChange}
              error={headingError}
            />
            <Form.Input
              name='name'
              placeholder='Name'
              value={name}
              onChange={onNameChange}
              error={nameError}
            />
            <p style={{ textAlign: "right", marginTop: 0 }}>
              {2000 - content.length}
            </p>
            <Form.TextArea
              name='text'
              value={content}
              onChange={onContentChange}
              rows={4}
              fluid
              placeholder='Content'
              error={contentError}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions className='modal-content'>
          <Button
            color='red'
            loading={loading}
            onClick={() => {
              setName("");
              setHeading(props.heading);
              setContent("");
              setLoading(false);
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
