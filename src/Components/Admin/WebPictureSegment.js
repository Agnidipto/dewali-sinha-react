import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import { postWebPicture, deleteWebPicture } from "./adminService";
import ErrorFunction from "../ErrorFunction";
import { Segment, Icon, Image, Button, Modal, Form } from "semantic-ui-react";

import Expand from "react-expand-animated";

function WebPictureSegment(props) {
  const [webPicture, setWebPicture] = useState(props.webPicture);

  const [show, setShow] = useState(false);
  const styles = { marginBottom: "15px" };
  const transitions = ["height", "opacity"];
  const [editPicture, setEditPicture] = useState(false);
  const [error, setError] = useState({
    open: false,
    message: null,
  });

  const segmentStyle = {
    width: "95%",
    margin: "auto auto 10px",
  };

  function deleteWebPictureFunction() {
    deleteWebPicture(webPicture.picId)
      .then((res) => console.log(res.data))
      .catch((err) => setError(ErrorFunction(err)));
  }

  return (
    <>
      <Segment inverted className='segment-border' style={segmentStyle}>
        <h3
          onClick={() => setShow(!show)}
          style={{
            width: "calc(100% - 30px)",
            backgroundColor: "#f2711c",
            display: "inline-block",
            margin: "0",
            paddingTop: "3px",
            height: "30px",
            borderRadius: ".28571429rem",
          }}
        >
          {webPicture.name} <Icon name={show ? "caret up" : "caret down"} />
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
          onClick={deleteWebPictureFunction}
        >
          <Icon name='delete' fitted style={{ height: 13, width: 13 }} />
        </Button>
        <Expand styles={styles} transitions={transitions} open={show}>
          <div style={{ paddingTop: 20 }}>
            <Image
              rounded
              centered
              size='large'
              src={"data:image/png;base64," + webPicture.file.file}
              style={{
                marginBottom: 20,
                maxHeight: "300px",
                width: "auto",
                maxWidth: "300px",
                height: "auto",
              }}
            />
            <p
              style={{
                cursor: "pointer",
                color: "#f2711c",
                display: "inline-block",
              }}
              onClick={() => setEditPicture(true)}
            >
              Edit
            </p>
          </div>
        </Expand>
      </Segment>
      <WebContentModal
        open={editPicture}
        setOpen={setEditPicture}
        file={webPicture.file.file}
        name={webPicture.name}
        heading={webPicture.heading}
      />
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
    </>
  );
}

export default withRouter(WebPictureSegment);

function WebContentModal(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const [error, setError] = React.useState({
    open: false,
    message: null,
  });

  const [loading, setLoading] = useState(false);

  // const [length, setLength] = useState(2000 - props.text.length);

  const [file, setFile] = useState("data:image/png;base64," + props.file);
  // const [file, setFile] = useState(false);
  const [text, setText] = useState("");

  const [textError, setTextError] = useState(false);

  // function onChange(e, { value }) {
  //   if (value.length <= 2000) setText(value);
  //   setLength(2000 - value.length);
  // }

  function handleFileChange(event) {
    // Assuming only image
    var file = event.target.files[0];

    if (file instanceof Blob) {
      var type = file.type;
      if (
        type === "image/png" ||
        type === "image/jpeg" ||
        type === "image/jpg"
      ) {
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        console.log(event.target.id);
        reader.onloadend = function (e) {
          setFile(reader.result);
        };
      } else {
        setError({
          open: true,
          message:
            "Invalid File Type! Please upload .jpg, .jpeg or .png files only.",
        });
      }
    } else {
      setError({
        open: true,
        message:
          "Invalid File Type! Please upload .jpg, .jpeg or .png files only.",
      });
    }
  }

  const imageStyle = {
    backgroundColor: "rgb(36, 35, 35)",
    height: "100px",
  };

  const renderInput = (
    <div
      style={{
        display: "inline-block",
        width: "100%",
        margin: "0 5px",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      {file ? (
        <>
          <label for='webPicture' style={{ display: "inline-block" }}>
            <Image
              rounded
              centered
              size='large'
              src={file}
              style={{
                marginBottom: 20,
                maxHeight: "200px",
                width: "auto",
                maxWidth: "200px",
                height: "auto",
              }}
            />
            <Button
              style={{ marginTop: "5px", padding: 0 }}
              circular
              color='black'
              onClick={() => setFile(null)}
              className='remove-image-icon'
            >
              <Icon
                fitted
                circular
                color='teal'
                name='delete'
                onClick={() => setFile(null)}
              />
            </Button>
          </label>
        </>
      ) : (
        <label for='webPicture'>
          <i className='fas fa-plus-square add-image-icon'></i>
        </label>
      )}
      <input
        type='file'
        id='webPicture'
        onChange={handleFileChange}
        style={{
          display: "none",
          width: 0,
          height: 0,
          visibility: "hidden",
        }}
      />
    </div>
  );

  function post() {
    if (file !== null) {
      postWebPicture(props.name, props.heading, file)
        .then((res) => {
          console.log(res.data);
          setOpen(false);
        })
        .catch((err) => setError(ErrorFunction(err)));
    } else setError({ open: true, message: "Please enter a valid File" });
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
          <h3 className='teal-text'>Picture for {props.name}</h3>
        </Modal.Header>
        <Modal.Content className='modal-content'>
          <Form>
            <p>Heading: {props.heading}</p>
            <p>Name: {props.name}</p>

            {renderInput}
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
