import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Segment, Form, Button, Modal } from "semantic-ui-react";
import ValidateEmail from "../../../Utility/ValidateEmail";
import ErrorModal from "../../Modals/ErrorModal";
import ErrorFunction from "../../ErrorFunction";
import login from "./adminLoginService";

function Login(props) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({ open: false, message: "Error" });

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  function checkErrors() {
    let flag = 0;
    if (
      user.email === "" ||
      user.email === null ||
      !ValidateEmail(user.email)
    ) {
      setEmailError("Please enter a valid email");
      flag = 1;
    } else {
      setEmailError(null);
    }
    if (user.password === "" || user.password === null) {
      setPasswordError("Please enter a valid password");
      flag = 1;
    } else {
      setPasswordError(null);
    }
    return flag;
  }

  function onChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    var errorPresent = checkErrors();
    if (errorPresent === 0) {
      login(user)
        .then((res) => {
          const response = res.data;
          localStorage.setItem("token", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
          props.setLoggedIn(true);
          props.history.push("/admin");
        })
        .catch((err) => {
          setError(ErrorFunction(err));
        });
    }
  }

  let emailInput = (
    <Form.Input
      error={emailError}
      placeholder='Email'
      name='email'
      onChange={onChange}
      onKeyPress={handleKeypress}
    />
  );

  let passwordInput = (
    <Form.Input
      error={passwordError}
      placeholder='Password'
      name='password'
      type='password'
      onChange={onChange}
      onKeyPress={handleKeypress}
    />
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 150,
        textAlign: "center",
      }}
    >
      <Segment
        inverted
        className='segment-border'
        style={{ width: "50%", margin: "auto", minWidth: "450px" }}
      >
        <h1 className='login-title'>Login!</h1>

        <Form inverted className='login-form'>
          <br />
          {emailInput}
          <br />
          {passwordInput}
          <div class='login-button'>
            <Button color='teal' onClick={handleSubmit} type='submit'>
              Login
            </Button>
          </div>
        </Form>
      </Segment>

      <ErrorModal
        open={error.open}
        setOpen={setError}
        message={error.message}
      />
    </div>
  );
}

export default withRouter(Login);
