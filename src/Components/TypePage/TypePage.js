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
import ReactGA from "react-ga";

import CardLoading from "../Cards/CardLoading";

function TypePage(props) {
  const [posts, setPosts] = useState([]);
  const params = useParams();
  const [type, setType] = useState(_.startCase(_.lowerCase(useParams().name)));
  const [error, setError] = useState({ open: false, message: null });
  let url = useLocation().pathname;
  const [loading, setLoading] = useState(true);
  var page = 0;
  var x = [];
  var total = 0;
  const [final, setFinal] = useState(0);
  const [loadCard, setLoadCard] = useState(0);

  useEffect(() => {
    ReactGA.initialize("UA-173426368-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
    getTypePostsCount(params.name)
      .then((res) => {
        const count = res.data;
        total = count;
        setFinal(count);
        setLoadCard(count);
        refreshPost();
      })
      .catch((err) => setError(ErrorFunction(err)));
  }, [type]);

  function refreshPost() {
    // for (var i = 0; i < total; i++)
    if (x.length < total)
      getTypePage(type, page)
        .then((res) => {
          res.data.map((data) => (data != null ? (x = x.concat(data)) : null));
          // x = x.concat(res.data[0]);

          setPosts(x);
          setLoading(false);

          page++;
          // console.log(page);
          refreshPost();
        })
        .catch((err) => setError(ErrorFunction(err)));
  }

  useEffect(() => {
    // console.log(posts);
  }, [posts]);

  useEffect(() => {
    window.scrollTo(0, 0);

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
                {posts.length !== final && (
                  <Grid.Column
                    computer={4}
                    tablet={8}
                    style={{ marginBottom: 20 }}
                  >
                    <CardLoading />
                  </Grid.Column>
                )}
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
