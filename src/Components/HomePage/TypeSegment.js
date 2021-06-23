import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Segment, Card, Grid, Button, Icon } from "semantic-ui-react";
import { getTypePage } from "./HomePageService";
import ErrorFunction from "../ErrorFunction";
import Cards from "../Cards/Cards";
import CardLoading from "../Cards/CardLoading";
import _ from "lodash";

function TypeSegment(props) {
  const [type, setType] = useState(props.type);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    var x = [];
    var i = 0;
    function refresh() {
      if (x.length < 3) {
        console.log(i);
        getTypePage(type, i)
          .then((res) => {
            res.data.map((data) =>
              data != null ? (x = x.concat(data)) : null
            );
            // x = x.concat(res.data[0]);
            setPosts(x);
            setLoading(false);
            i++;
            refresh();
          })
          .catch((err) => props.setError(ErrorFunction(err)));
      }
    }
    refresh();
  }, []);

  const segmentStyle = {
    width: "95%",
    margin: "auto",
    marginBottom: 20,
    paddingBottom: 0,
  };

  return (
    <Segment inverted className='segment-border' style={segmentStyle}>
      <p
        style={{ marginBottom: 20, fontSize: 40 }}
        className='cursive light-teal-text'
      >
        {type}
      </p>

      <Grid>
        <Grid.Row>
          {posts.map((post) => (
            <Grid.Column computer={4} tablet={8} style={{ marginBottom: 20 }}>
              <Cards post={post} setError={props.setError} />
            </Grid.Column>
          ))}
          {posts.length != 3 &&
            _.times(3 - posts.length, (i) => (
              <Grid.Column computer={4} tablet={8} style={{ marginBottom: 20 }}>
                <CardLoading />
              </Grid.Column>
            ))}
          <Grid.Column computer={4} tablet={8} style={{ marginBottom: 20 }}>
            <Card
              className='custom-card'
              link
              onClick={() => props.history.push("/type/" + type)}
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
