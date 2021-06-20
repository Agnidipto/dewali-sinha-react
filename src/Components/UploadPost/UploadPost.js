import React, { useState, useEffect, useCallback, useRef } from "react";
import { withRouter, useParams } from "react-router-dom";
import { Segment, Form, Image, Button, Icon } from "semantic-ui-react";
import _ from "lodash";

import addPicture from "../../Utility/Pictures/addPicture.png";
import ErrorModal from "../Modals/ErrorModal";
import "./UploadPost.css";
import ErrorFunction from "../ErrorFunction";

import Cropper from "react-easy-crop";
import savePost, { authority } from "./uploadPostService";
import getCroppedImg from "../../Utility/cropImage";

import Menubar from "../../Containers/Menubar/Menubar";

function UploadPost(props) {
  const [type, setType] = useState(_.startCase(_.toLower(useParams().type)));
  const [post, setPost] = useState({
    name: "",
    description: "",
    materials: "",
    type: type,
  });
  const [auth, setAuth] = useState(false);

  const [files, setFiles] = useState({
    file1: null,
    file2: null,
    file3: null,
  });

  const [error, setError] = useState({ open: false, messaage: null });

  const [postSaving, setPostSaving] = useState(false);

  const [showCrop, setShowCrop] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState(0);

  const fileRef = useRef(null);

  useEffect(() => {
    authority()
      .then((res) => setAuth(true))
      .catch((err) => setError(ErrorFunction(err)));
  }, [0]);
  //crop functions
  const cropstyle = {
    position: "relative",
    width: "50%",
    height: 200,
    background: "#333",
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      if (files.file1 == null) setFiles({ ...files, file1: croppedImage });
      else if (files.file2 == null) setFiles({ ...files, file2: croppedImage });
      else if (files.file3 == null) setFiles({ ...files, file3: croppedImage });
      setShowCrop(false);
    } catch (e) {
      setError({ open: true, message: "Check Type of File!" });
    }
  }, [croppedAreaPixels, rotation]);

  function shiftLeft(number) {
    switch (number) {
      case "file1": {
        setFiles({
          ...files,
          file1: files.file2,
          file2: files.file3,
          file3: null,
        });
        break;
      }
      case "file2": {
        setFiles({ ...files, file2: files.file3, file3: null });
        break;
      }
      case "file3":
        setFiles({ ...files, file3: null });
    }
  }

  //image functions

  function removeImage(event) {
    console.log(event.target.id);
    shiftLeft(event.target.id);
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
          setImgSrc(reader.result);
          setShowCrop(true);
          //setFiles({ ...files, [event.target.id]: reader.result });
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

  function handleTextChange(event, { name, value }) {
    setPost({ ...post, [name]: value });
    console.log(post);
  }

  async function handleSubmit() {
    setPostSaving(true);
    savePost(post, files)
      .then((res) => {
        setPostSaving(false);
        props.history.push("/admin");
        console.log(res.data);
      })
      .catch((err) => {
        setError({ open: true, message: err.response.data });
        console.log(err);
        setPostSaving(false);
      });
    // console.log(post);
  }

  const imageStyle = {
    backgroundColor: "rgb(36, 35, 35)",
    height: "100px",
    // width: "20%",
  };

  function renderOtherInput(id) {
    return (
      <div
        style={{
          display: "inline-block",
          width: "fit-content",
          margin: "0 5px",
        }}
      >
        {files[id] ? (
          <>
            <label for={id} style={{ display: "inline-block" }}>
              <Image
                style={imageStyle}
                rounded
                src={files[id] ? files[id] : addPicture}
              />
              <Button
                style={{ marginTop: "5px", padding: 0 }}
                circular
                color='black'
                id={id}
                onClick={removeImage}
                className='remove-image-icon'
              >
                <Icon
                  fitted
                  circular
                  color='teal'
                  name='delete'
                  id={id}
                  onClick={removeImage}
                />
              </Button>
            </label>
          </>
        ) : (
          <label for={id}>
            <i className='fas fa-plus-square add-image-icon'></i>
          </label>
        )}
        <input
          type='file'
          id={id}
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
  }

  const renderImages = (
    <div style={{ marginBottom: "10px" }}>
      {renderOtherInput("file1")}
      {files.file1 && renderOtherInput("file2")}
      {files.file2 && renderOtherInput("file3")}
    </div>
  );

  return (
    <>
      {auth ? (
        <div
          style={{
            paddingTop: "50px",
            textAlign: "center",
            minHeight: "100vh",
          }}
        >
          <Menubar toggleSideBar={props.toggleSideBar} text='Upload Post' />
          {showCrop ? (
            <div style={{ zIndex: "-1", marginTop: 15 }}>
              <div
                style={{
                  height: "400px",
                  position: "relative",
                  background: "#333",
                  margin: "0 100px 0",
                  zIndex: "0",
                }}
              >
                <Cropper
                  image={imgSrc}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZ
                  zoomChange={setZoom}
                />
              </div>
              <div className='controls'>
                <Form inverted style={{ width: "60%", margin: "20px 20%" }}>
                  <div className='sliderContainer'>
                    <Form.Input
                      label='Zoom'
                      min={1}
                      max={3}
                      name='zoom'
                      onChange={(e, { value }) => setZoom(value)}
                      step={0.1}
                      type='range'
                      value={zoom}
                    />
                  </div>
                  <div className='sliderContainer'>
                    <Form.Input
                      label='Rotation'
                      min={0}
                      max={360}
                      name='rotation'
                      onChange={(e, { value }) => setRotation(value)}
                      step={1}
                      type='range'
                      value={rotation}
                    />
                  </div>
                  <Button
                    onClick={showCroppedImage}
                    primary
                    className='cropButton'
                  >
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          ) : (
            <div style={{ paddingTop: "50px" }}>
              <Segment
                inverted
                style={{ width: "60%", minWidth: 450, margin: "auto" }}
                className='segment-border'
              >
                <h1>Upload post {type}</h1>

                <Form>
                  <Form.Input
                    placeholder='Name of the Post'
                    size='large'
                    name='name'
                    value={post.name}
                    onChange={handleTextChange}
                  />
                  <p style={{ textAlign: "right" }}>
                    {post.description.length}
                  </p>
                  <Form.TextArea
                    placeholder='Description'
                    size='large'
                    name='description'
                    value={post.description}
                    onChange={handleTextChange}
                  />
                  <Form.Input
                    placeholder='Materials required, separated by semicolon (;)'
                    name='materials'
                    value={post.materials}
                    onChange={handleTextChange}
                  />
                  {renderImages}
                </Form>
                <Button
                  onClick={handleSubmit}
                  color='teal'
                  loading={postSaving}
                >
                  Submit
                </Button>
              </Segment>
            </div>
          )}

          <ErrorModal
            open={error.open}
            setOpen={setError}
            message={error.message}
          />
        </div>
      ) : (
        <h1 style={{ paddingTop: 100 }}>Access Denied</h1>
      )}
    </>
  );
}

export default withRouter(UploadPost);
