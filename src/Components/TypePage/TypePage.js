import React, { useState, useEffect } from "react";
import {
  withRouter,
  useParams,
  useHistory,
  useLocation,
} from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import ErrorFunction from "../ErrorFunction";
import MenuBar from "../../Containers/Menubar/Menubar";
import getTypePostsCount, { getTypePage } from "./TypePageService";
import _ from "lodash";
import { Grid, Card, Icon, Button, Segment } from "semantic-ui-react";
import Cards from "../Cards/Cards";

function TypePage(props) {
  const [posts, setPosts] = useState([]);
  const params = useParams();
  const [type, setType] = useState(_.startCase(_.lowerCase(useParams().name)));
  const [error, setError] = useState({ open: false, message: null });
  let url = useLocation().pathname;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTypePostsCount(params.name)
      .then((res) => {
        getTypePage(type, res.data)
          .then((res) => {
            setPosts(res.data);
            setLoading(false);
          })
          .catch((err) => setError(ErrorFunction(err)));
      })
      .catch((err) => setError(ErrorFunction(err)));
  }, [type]);

  useEffect(() => {
    setType(_.startCase(_.lowerCase(params.name)));
    setLoading(true);
    setPosts([]);
  }, [params.name]);

  const segmentStyle = {
    width: "95%",
    margin: "auto",
    marginBottom: 20,
    paddingBottom: 0,
  };

  return (
    <>
      <MenuBar toggleSideBar={props.toggleSideBar} text={type} />
      <div style={{ minHeight: "100vh", paddingTop: 100 }}>
        <Segment inverted className='segment-border' style={segmentStyle}>
          {loading ? (
            <Icon loading size='huge' name='spinner' style={{ margin: 100 }} />
          ) : (
            <Grid>
              <Grid.Row>
                {posts.map((post) => (
                  <Grid.Column
                    computer={4}
                    tablet={8}
                    style={{ marginBottom: 20 }}
                  >
                    <Cards post={post} setError={props.setError} />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          )}
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
