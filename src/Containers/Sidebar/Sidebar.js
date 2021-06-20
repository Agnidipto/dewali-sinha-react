import React, { useState, useEffect } from "react";
import { Icon, Menu, Sidebar } from "semantic-ui-react";
import { withRouter, useParams, useLocation } from "react-router-dom";
import getAllTypes from "./SidebarService";
import Expand from "react-expand-animated";
import "./Sidebar.css";

function AppSidebar(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [types, setTypes] = useState([]);

  const [show, setShow] = useState(true);
  const styles = {};
  const transitions = ["height", "opacity"];
  const [admin, setAdmin] = useState(false);
  const params = useParams();
  let url = useLocation().pathname;

  useEffect(() => {
    getAllTypes()
      .then((res) => {
        setTypes(res.data);
      })
      .catch((err) => console.log("Error Fetching Types"));
  }, []);

  // useEffect(() => {
  //   localStorage.getItem("token") !== null
  //     ? setLoggedIn(true)
  //     : setLoggedIn(false);
  // }, [url]);

  const menustyle = { textAlign: "left", padding: "13px 16px" };
  const substyle = { textAlign: "left", padding: "13px 20%" };

  return (
    <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      inverted
      onHide={props.onHide}
      vertical
      visible={props.visible}
      style={{ position: "fixed", width: "25%", minWidth: "200px" }}
      onVisible={() => {
        localStorage.getItem("token") != null
          ? setLoggedIn(true)
          : setLoggedIn(false);
      }}
    >
      <div
        as='a'
        style={{ height: "15%" }}
        className='clickable header'
        onClick={() => props.history.push("/")}
      >
        <h3
          style={{
            padding: 0,
            position: "relative",
            top: "50%",
            left: "50%",
            fontSize: 45,
            transform: "translate(-50%,-50%)",
          }}
          className='cursive'
        >
          Dewali
        </h3>
      </div>

      <div
        as='a'
        onClick={() => {
          setShow(!show);
        }}
        color='red'
        style={menustyle}
        className='clickable posts'
      >
        <Icon name='write' style={{ display: "inline-block" }} />

        <h3 style={{ display: "inline-block", margin: "0 5%" }}>
          Posts <Icon name='caret down' />
        </h3>
      </div>
      <Expand styles={styles} transitions={transitions} open={show}>
        {types.map((type) => (
          <div
            as='a'
            style={substyle}
            className='clickable posts'
            onClick={() => props.history.push("/type/" + type)}
          >
            <h4>{type}</h4>
          </div>
        ))}
      </Expand>

      {props.loggedIn && (
        <>
          <div
            style={menustyle}
            as='a'
            onClick={() => setAdmin(!admin)}
            className='clickable admin'
          >
            <Icon name='user' style={{ display: "inline-block" }} />

            <h3 style={{ display: "inline-block", margin: "0 5%" }}>
              Admin <Icon name='caret down' />
            </h3>
          </div>
          <Expand open={admin} styles={styles} transitions={transitions}>
            <div
              as='a'
              style={substyle}
              className='clickable admin'
              onClick={() => props.history.push("/admin")}
            >
              <h4>Admin Board</h4>
            </div>
            <div
              as='a'
              style={substyle}
              className='clickable admin'
              onClick={() => props.history.push("/signup")}
            >
              <h4>Sign Up</h4>
            </div>
          </Expand>
        </>
      )}
      <div
        style={menustyle}
        as='a'
        className='clickable signin'
        onClick={() => props.history.push("/login")}
      >
        <Icon name='sign-in' style={{ display: "inline-block" }} />

        <h3 style={{ display: "inline-block", margin: "0 5%" }}>Log in</h3>
      </div>
    </Sidebar>
  );
}

export default withRouter(AppSidebar);
