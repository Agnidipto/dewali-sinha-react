import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Segment, Card, Grid, Button, Icon } from "semantic-ui-react";
import { getTypePage, deleteType } from "./adminService";
import ErrorFunction from "../ErrorFunction";
import Cards from "../Cards/Cards";
import _ from "lodash";
import deletePost from "../Cards/CardService";

function TypeSegment(props) {
  const [type, setType] = useState(props.type);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    refreshPosts();
  }, [0]);

  function refreshPosts() {
    getTypePage(type, 3)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => props.setError(ErrorFunction(err)));
  }

  const segmentStyle = {
    width: "95%",
    margin: "auto",
    marginBottom: 20,
    paddingBottom: 0,
  };

  function deleteTypeFunction(e) {
    deleteType(type)
      .then((res) => console.log(res.data))
      .catch((err) => props.setError(ErrorFunction(err)));
  }

  return (
    <Segment inverted className='segment-border' style={segmentStyle}>
      <h1 style={{ marginBottom: 20 }}>
        {type} <Icon name='delete' onClick={deleteTypeFunction} />
      </h1>
      <Grid>
        <Grid.Row>
          {posts.map((post) => (
            <Grid.Column computer={4} tablet={8} style={{ marginBottom: 20 }}>
              <Cards
                post={post}
                extra={true}
                refreshPosts={refreshPosts}
                setError={props.setError}
              />
            </Grid.Column>
          ))}
          <Grid.Column computer={4} tablet={8} style={{ marginBottom: 20 }}>
            <Card
              className='custom-card'
              link
              onClick={() =>
                props.history.push("/admin/type/" + _.lowerCase(type))
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
                    <h1 style={{ color: "white" }}>Show All</h1>
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
        </Grid.Row>
      </Grid>
    </Segment>
  );
}

export default withRouter(TypeSegment);
