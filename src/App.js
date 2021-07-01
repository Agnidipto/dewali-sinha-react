import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

import HomePage from "./Components/HomePage/HomePage";
import Login from "./Components/Login/AdminLogin/AdminLogin";
import Signup from "./Components/Signup/Signup";
import UploadPost from "./Components/UploadPost/UploadPost";
import EditPost from "./Components/UploadPost/EditPost";
import Admin from "./Components/Admin/Admin";
import TypePage from "./Components/TypePage/TypePage";
import TypePageAdmin from "./Components/Admin/TypePageAdmin";
import PostPage from "./Components/PostPage/PostPage";

import AppSidebar from "./Containers/Sidebar/Sidebar";
import { Sidebar } from "semantic-ui-react";
import Footer from "./Containers/Footer/Footer";

import ReactGA from "react-ga";

function App() {
  useEffect(() => {
    ReactGA.initialize("UA-173426368-1");
  }, []);
  const [visible, setVisible] = useState(false);

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  function toggleSideBar() {
    setVisible(!visible);
  }
  return (
    <div className='App'>
      <Router>
        <Sidebar.Pushable style={{ transform: "none" }}>
          <AppSidebar
            visible={visible}
            onHide={() => setVisible(false)}
            loggedIn={loggedIn}
          />

          <Sidebar.Pusher dimmed={visible}>
            <Switch>
              <Route path='/' exact>
                <HomePage toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/login' exact>
                <Login
                  toggleSideBar={toggleSideBar}
                  setLoggedIn={setLoggedIn}
                />
              </Route>
              <Route path='/signup' exact>
                <Signup toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/upload/:type' exact>
                <UploadPost toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/admin' exact>
                <Admin toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/type/:name'>
                <TypePage toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/admin/type/:name' exact>
                <TypePageAdmin toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/post/:id' exact>
                <PostPage toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/edit/:id' exact>
                <EditPost toggleSideBar={toggleSideBar} />
              </Route>
            </Switch>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
