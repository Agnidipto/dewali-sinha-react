import React, { useState, useEffect, useRef } from "react";
import MenuBar from "../../Containers/Menubar/Menubar";
import { withRouter, useParams } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import NewTypeModal from "../Modals/NewTypeModal";
import authority, { getTypeCount, getAllTypes } from "./adminService";
import ErrorFunction from "../ErrorFunction";
import TypeSegment from "./TypeSegment";
import { Segment, Menu, Sticky, Ref, Button } from "semantic-ui-react";
import WebContent from "./WebContent";
import WebPictures from "./WebPictures";
function Admin(props) {
  const [error, setError] = useState({ open: false, message: null });
  const [auth, setAuth] = useState(false);
  const [types, setTypes] = useState([]);
  const [typesCount, setTypesCount] = useState(0);
  const [activeItem, setActiveItem] = useState("posts");
  const [createNewType, setCreateNewType] = useState(false);
  const stickyRef = useRef(null);

  useEffect(() => {
    authority()
      .then((res) => {
        console.log(res.data);
        setAuth(true);
        getAllTypes()
          .then((res) => {
            setTypes(res.data);
            setTypesCount(res.data.length);
          })
          .catch((err) => {
            setError(ErrorFunction(err));
          });
      })
      .catch((err) => {
        setError(ErrorFunction(err));
      });
  }, [0]);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const segmentStyle = {
    width: "95%",
    margin: "auto",
    marginBottom: 20,
  };

  const menuItemStyle = {
    textAlign: "center",
    width: "33.3%",
    justifyContent: "center",
  };

  return (
    <>
      <MenuBar toggleSideBar={props.toggleSideBar} text='Admin' />
      <div style={{ minHeight: "100vh", paddingTop: 100 }}>
        {auth ? (
          <Ref innerRef={stickyRef}>
            <div>
              <Sticky context={stickyRef} offset={64}>
                <Menu inverted>
                  <Menu.Item
                    name='posts'
                    color='red'
                    active={activeItem === "posts"}
                    onClick={handleItemClick}
                    style={menuItemStyle}
                  />
                  <Menu.Item
                    name='web Content'
                    color='teal'
                    active={activeItem === "web Content"}
                    onClick={handleItemClick}
                    style={menuItemStyle}
                  />
                  <Menu.Item
                    name='web Pictures'
                    color='orange'
                    active={activeItem === "web Pictures"}
                    onClick={handleItemClick}
                    style={menuItemStyle}
                  />
                </Menu>
              </Sticky>

              {activeItem === "posts" && (
                <div
                  style={{
                    paddingTop: 20,
                    background: "black",
                    paddingBottom: 20,
                  }}
                >
                  <Segment
                    inverted
                    className='segment-border'
                    style={segmentStyle}
                  >
                    <Button
                      fluid
                      color='red'
                      onClick={() => setCreateNewType(true)}
                    >
                      Create New Type of Post
                    </Button>
                  </Segment>
                  {types.map((type) => (
                    <TypeSegment type={type} setError={setError} />
                  ))}
                </div>
              )}
              {activeItem === "web Content" && <WebContent />}
              {activeItem === "web Pictures" && <WebPictures />}
            </div>
          </Ref>
        ) : (
          <h1>Unauthorized</h1>
        )}
        <NewTypeModal open={createNewType} setOpen={setCreateNewType} />
        <ErrorModal
          open={error.open}
          message={error.message}
          setOpen={setError}
        />
      </div>
    </>
  );
}

export default withRouter(Admin);
