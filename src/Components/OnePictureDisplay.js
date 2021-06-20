import React from "react";
import { Segment, Modal, Image, Button } from "semantic-ui-react";

function OnePictureDisplay(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const picture = props.picture;
  const heading = props.heading;

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      // size='fullscreen'
      size='large'
      dimmer={true}
      className='picture-display'
    >
      {heading && (
        <Modal.Header className='modal-header' style={{ textAlign: "center" }}>
          <h3 className='teal-text'>{heading}</h3>
        </Modal.Header>
      )}
      <Modal.Content className='modal-content'>
        <Image style={{ width: "100%" }} centered src={picture} />
      </Modal.Content>
      <Modal.Actions className='modal-content' style={{ textAlign: "center" }}>
        <Button
          secondary
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default OnePictureDisplay;
