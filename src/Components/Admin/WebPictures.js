import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import {
  getWebPictureByHeading,
  getWebPictureHeadings,
  postWebPicture,
} from "./adminService";
import ErrorFunction from "../ErrorFunction";
import {
  Segment,
  Button,
  Form,
  Input,
  Modal,
  Icon,
  Image,
} from "semantic-ui-react";
import WebPictureSegment from "./WebPictureSegment";

function WebPictures(props) {
  const [error, setError] = useState({ open: false, message: null });
  const [webPictures, setWebPictures] = useState({});
  const [webPictureHeadings, setWebPictureHeadings] = useState([]);
  const segmentStyle = {
    width: "95%",

    marginBottom: 20,
    margin: "auto auto 20px",
  };

  const [newPicture, setNewPicture] = useState(false);
  const [header, setHeader] = useState("");

  useEffect(() => {
    getWebPictureHeadings()
      .then((res) => {
        setWebPictureHeadings(res.data);
        var object = {};
        res.data.forEach((data) => {
          getWebPictureByHeading(data)
            .then((res) => {
              object = { ...object, [data]: res.data };
              setWebPictures(object);
            })
            .catch((err) => setError(ErrorFunction(err)));
        });
      })
      .catch((err) => setError(ErrorFunction(err)));
  }, []);

  return (
    <>
      <div style={{ padding: "20px 0", background: "black", height: "100%" }}>
        <Segment inverted style={segmentStyle} className='segment-border'>
          <Button
            fluid
            color='orange'
            onClick={() => {
              setHeader(null);
              setNewPicture(true);
            }}
          >
            New Web Picture
          </Button>
        </Segment>
        {webPictureHeadings.map((headings) => (
          <Segment inverted style={segmentStyle} className='segment-border'>
            <h2>{headings}</h2>
            {webPictures[headings] &&
              webPictures[headings].map((webPicture) => (
                <WebPictureSegment webPicture={webPicture} />
              ))}

            <Button
              color='orange'
              onClick={() => {
                setHeader(headings);
                setNewPicture(true);
              }}
            >
              New Web Picture
            </Button>
          </Segment>
        ))}
      </div>
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />

      <NewWebPicture
        open={newPicture}
        setOpen={setNewPicture}
        heading={header}
      />
    </>
  );
}

export default withRouter(WebPictures);

function NewWebPicture(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const [error, setError] = React.useState({
    open: false,
    message: null,
  });

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);

  const [name, setName] = useState("");
  const [heading, setHeading] = useState(props.heading);
  useEffect(() => {
    setHeading(props.heading);
  }, [props.heading]);

  const [nameError, setNameError] = useState(false);
  const [headingError, setHeadingError] = useState(false);

  function onNameChange(e, { value }) {
    setName(value);
  }

  function onHeadingChange(e, { value }) {
    setHeading(value);
  }

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
        maxHeight: "400px",
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
      console.log(name, heading);
      postWebPicture(name, heading, file)
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
          setName("");
          setHeading(null);
          setLoading(false);
          setNameError(false);
          setHeadingError(false);
          setOpen(false);
          setFile(null);
        }}
        size='tiny'
        dimmer={true}
      >
        <Modal.Header className='modal-header'>
          <h3 className='teal-text'>Picture for {props.name}</h3>
        </Modal.Header>
        <Modal.Content className='modal-content'>
          <Form>
            {props.heading ? (
              <p>Heading: {props.heading}</p>
            ) : (
              <Form.Input
                name='heading'
                placeholder='Heading'
                value={heading}
                onChange={onHeadingChange}
              />
            )}

            <Form.Input
              name='name'
              placeholder='Name'
              value={name}
              onChange={onNameChange}
            />

            {renderInput}
          </Form>
        </Modal.Content>
        <Modal.Actions className='modal-content'>
          <Button
            color='red'
            loading={loading}
            onClick={() => {
              setName("");
              setHeading(null);
              setLoading(false);
              setNameError(false);
              setHeadingError(false);
              setOpen(false);
              setFile(null);
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
