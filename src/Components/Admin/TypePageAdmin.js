import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import ErrorFunction from "../ErrorFunction";
import MenuBar from "../../Containers/Menubar/Menubar";
import authority, { getTypePage, getTypePostsCount } from "./adminService";
import { Grid, Card, Icon, Button, Segment } from "semantic-ui-react";
import Cards from "../Cards/Cards";
import _ from "lodash";
import "./Admin.css";

function TypePage(props) {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState(_.startCase(_.toLower(useParams().name)));
  const [error, setError] = useState({ open: false, message: null });

  useEffect(() => {
    authority()
      .then((res) => {
        refreshPosts();
      })
      .catch((err) => setError(ErrorFunction(err)));
  }, [0]);

  function refreshPosts() {
    getTypePostsCount(type)
      .then((res) => {
        getTypePage(type, res.data)
          .then((res) => {
            setPosts(res.data);
          })
          .catch((err) => setError(ErrorFunction(err)));
      })
      .catch((err) => setError(ErrorFunction(err)));
  }

  const segmentStyle = {
    width: "95%",
    margin: "auto",
    marginBottom: 20,
    paddingBottom: 0,
  };

  return (
    <>
      <MenuBar toggleSideBar={props.toggleSideBar} text={"Admin " + type} />
      <div style={{ minHeight: "100vh", paddingTop: 100 }}>
        <Segment inverted className='segment-border' style={segmentStyle}>
          <h1>{type}</h1>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={4} tablet={8} style={{ marginBottom: 20 }}>
                <Card
                  className='post-card-showmore custom-card'
                  link
                  onClick={() =>
                    props.history.push(`/upload/${_.lowerCase(type)}`)
                  }
                  style={{
                    boxShadow: "none",
                    height: "100%",
                    marginBottom: 20,
                    minHeight: 150,
                  }}
                >
                  <Card.Content>
                    <Card.Description style={{ height: "100%" }}>
                      <div
                        style={{
                          padding: 0,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                        }}
                      >
                        <h1 style={{ color: "white" }}>New Post</h1>
                        <Button
                          icon
                          size='huge'
                          circular
                          primary
                          style={{
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <Icon
                            name='angle right'
                            fitted
                            size='large'
                            style={{ height: 30, width: 30, paddingLeft: 2 }}
                          />
                        </Button>
                      </div>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              {posts.map((post) => (
                <Grid.Column
                  computer={4}
                  tablet={8}
                  style={{ marginBottom: 20 }}
                >
                  <Cards
                    post={post}
                    extra={true}
                    refreshPosts={refreshPosts}
                    setError={props.setError}
                  />
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
    </>
  );
}

export default withRouter(TypePage);
