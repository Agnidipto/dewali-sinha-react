import React, { useState } from "react";
import { Form, Button, Segment } from "semantic-ui-react";
import validateEmail from "../../Utility/ValidateEmail";
import { validatePassword } from "../../Utility/Validation";
import { withRouter } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import signup from "./signupService";
import login from "../Login/AdminLogin/adminLoginService";

function Signup(props) {
  /////states
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: ["mod", "user", "admin"],
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [userExists, setUserExists] = useState(false);

  const [error, setError] = useState({ open: false, message: null });

  ///////handle Functions

  function onChange(event, { name, value }) {
    setUser({ ...user, [name]: value });
  }

  function handleConfirmPassword(event, { value }) {
    setConfirmPassword(value);
  }

  /////handle Errors
  function handleErrors() {
    console.log(user.username);
    if (user.username === "" || user.username === null) {
      setNameError("Please enter your name");
    } else {
      if (user.username.length > 20)
        setNameError("Username exceeds 20 characters");
      else setNameError(null);
    }

    if (user.email === "" || user.email === null) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError(null);
      if (!validateEmail(user.email))
        setEmailError("Invalid email. Format should be <name>@<gmail>.<com>");
      else if (user.email.length > 50)
        setEmailError("Email exceeds 50 characters");
    }

    if (user.password === "" || user.password === null) {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError(null);
      if (!validatePassword(user.password)) {
        setPasswordError(
          "Should be of atleast length 8, requires one lowercase, one uppercase alphabet, and a number "
        );
      }
    }

    if (confirmPassword === "" || confirmPassword === null) {
      setConfirmPasswordError("Confirm your password");
    } else {
      setConfirmPasswordError(null);
      if (confirmPassword !== user.password) {
        setConfirmPasswordError("Passwords do not match");
      }
    }
  }

  function handleSubmit(event) {
    handleErrors();
    if (
      nameError === null &&
      emailError === null &&
      passwordError === null &&
      confirmPasswordError === null
    ) {
      signup(user)
        .then((res) => {
          const response = res.data;
          console.log(response);
          login(user)
            .then((res1) => {
              localStorage.setItem("token", response.accessToken);
              localStorage.setItem("refreshToken", response.refreshToken);
              props.history.push("/");
            })
            .catch((err) => {
              console.log(err.response.data);
              setError({ open: true, message: err.response.data });
            });
        })
        .catch((err) => {
          console.log(err.response.data);
          setError({ open: true, message: err.response.data });
        });
    }
  }

  //////Inputs

  const nameInput = (
    <Form.Input
      error={nameError}
      placeholder='Username'
      name='username'
      onChange={onChange}
    />
  );

  const emailInput = (
    <Form.Input
      error={emailError}
      placeholder='Email'
      name='email'
      onChange={onChange}
    />
  );

  const passwordInput = (
    <Form.Input
      error={passwordError}
      placeholder='Password'
      name='password'
      type='password'
      onChange={onChange}
    />
  );

  const confirmPasswordInput = (
    <Form.Input
      error={confirmPasswordError}
      placeholder='Confirm Password'
      name='confirmPassword'
      type='password'
      onChange={handleConfirmPassword}
    />
  );

  //////////return

  return (
    <div
      style={{ minHeight: "100vh", paddingTop: "100px", textAlign: "center" }}
    >
      <Segment
        inverted
        className='segment-border'
        style={{ width: "60%", margin: "auto", minWidth: 400 }}
      >
        <h1 className='login-title'>Admin SignUp</h1>

        <p style={{ textAlign: "left" }}>Credentials: </p>

        <Form inverted className='login-form'>
          {nameInput}
          <br />
          {emailInput}

          <p style={{ textAlign: "left" }}>Passwords: </p>
          <Form.Group widths='equal'>
            {passwordInput}
            <br />
            {confirmPasswordInput}
          </Form.Group>

          <div class='login-button'>
            <Button color='blue' onClick={handleSubmit} type='submit'>
              SignUp
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

export default withRouter(Signup);
