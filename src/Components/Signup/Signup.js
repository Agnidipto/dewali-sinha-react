import React, { useState, useEffect } from "react";
import { Form, Button, Segment } from "semantic-ui-react";
import validateEmail from "../../Utility/ValidateEmail";
import { validatePassword } from "../../Utility/Validation";
import { withRouter } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import ErrorFunction from "../ErrorFunction";
import signup, { authority } from "./signupService";
import login from "../Login/AdminLogin/adminLoginService";
import Menubar from "../../Containers/Menubar/Menubar";

function Signup(props) {
  /////states

  const [auth, setAuth] = useState(false);
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

  useEffect(() => {
    window.scrollTo(0, 0);

    authority()
      .then((res) => setAuth(true))
      .catch((err) => setError(ErrorFunction(err)));
  }, [0]);

  ///////handle Functions

  function onChange(event, { name, value }) {
    setUser({ ...user, [name]: value });
  }

  function handleConfirmPassword(event, { value }) {
    setConfirmPassword(value);
  }

  /////handle Errors
  function handleErrors() {
    let flag = 0;
    if (user.username === "" || user.username === null) {
      setNameError("Please enter your name");
      flag = 1;
    } else {
      if (user.username.length > 20) {
        setNameError("Username exceeds 20 characters");
        flag = 1;
      } else setNameError(null);
    }

    if (user.email === "" || user.email === null) {
      setEmailError("Please enter a valid email");
      flag = 1;
    } else {
      setEmailError(null);
      if (!validateEmail(user.email)) {
        setEmailError("Invalid email. Format should be <name>@<gmail>.<com>");
        flag = 1;
      } else if (user.email.length > 50) {
        setEmailError("Email exceeds 50 characters");
        flag = 1;
      }
    }

    if (user.password === "" || user.password === null) {
      setPasswordError("Please enter a password");
      flag = 1;
    } else {
      setPasswordError(null);
      if (!validatePassword(user.password)) {
        setPasswordError(
          "Should be of atleast length 8, requires one lowercase, one uppercase alphabet, and a number "
        );
        flag = 1;
      }
    }

    if (confirmPassword === "" || confirmPassword === null) {
      setConfirmPasswordError("Confirm your password");
      flag = 1;
    } else {
      setConfirmPasswordError(null);
      if (confirmPassword !== user.password) {
        flag = 1;
        setConfirmPasswordError("Passwords do not match");
      }
    }

    return flag;
  }

  function handleSubmit(event) {
    if (handleErrors() === 0) {
      signup(user)
        .then((res) => {
          const response = res.data;
          login(user)
            .then((res1) => {
              localStorage.setItem("token", res1.data.accessToken);
              localStorage.setItem("refreshToken", res1.data.refreshToken);
              props.history.push("/");
            })
            .catch((err) => {
              setError({ open: true, message: err.response.data });
            });
        })
        .catch((err) => {
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
    <>
      <Menubar text='Dewali Sinha' toggleSideBar={props.toggleSideBar} />

      {auth ? (
        <div
          style={{
            minHeight: "100vh",
            paddingTop: "130px",
            textAlign: "center",
          }}
        >
          <Segment
            inverted
            className='segment-border'
            style={{ width: "60%", margin: "auto auto 20px", minWidth: 400 }}
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
      ) : (
        <div style={{ minHeight: "100vh" }}>
          <div
            style={{
              padding: 0,

              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <h1 style={{ fontSize: "40px" }}>Access Denied</h1>
          </div>
        </div>
      )}
    </>
  );
}

export default withRouter(Signup);
