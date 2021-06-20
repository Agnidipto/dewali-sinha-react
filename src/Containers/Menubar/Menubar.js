import React, { useState, useEffect } from "react";
import { Dropdown, Icon, Image, Sticky, Ref } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import "./Menubar.css";

const Menubar = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [transStyle, setTransStyle] = useState({ background: "none" });

  const listenScrollEvent = (e) => {
    if (window.scrollY > 60) {
      setTransStyle({ background: "rgb(36, 35, 35)", color: "#6bbeba" });
    } else {
      setTransStyle({ background: "none", color: "white" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.addEventListener("scroll", listenScrollEvent);
    };
  }, [0]);

  function handleLogout(event) {
    localStorage.setItem("user", null);
    props.history.push("/loginsignup");
  }

  return (
    <div className='Menubar' style={transStyle}>
      <i
        class='fas fa-bars fa-2x'
        onClick={props.toggleSideBar}
        style={{ margin: 20 }}
      ></i>

      <p
        style={{ margin: "8px 15px", fontSize: 36, justifyContent: "center" }}
        className='cursive'
      >
        {props.text}
      </p>
    </div>
  );
};

export default withRouter(Menubar);
