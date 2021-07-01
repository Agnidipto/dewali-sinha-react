import React, { useState } from "react";
import { Card, Image, Button, Confirm } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import deletePost from "./CardService";
import TimeAgo from "../../Utility/TimeAgo";

import ErrorFunction from "../ErrorFunction";

function Cards(props) {
  const [post, setPost] = useState(props.post);
  const [extra, setExtra] = useState(props.extra);
  const [refreshPosts, setRefreshPosts] = useState(props.refreshPosts);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function deletePostFunction(e) {
    console.log(post.postId);
    setDeleteOpen(false);
    deletePost(post.postId)
      .then((res) => {
        props.refreshPosts();
        console.log(res.data);
      })
      .catch((err) => props.setError(ErrorFunction(err)));
  }

  const content = post.pictures[0]
    ? post.description.length > 35
      ? post.description.substring(0, 35) + "..."
      : post.description.substring(0, 35)
    : post.description.length > 50
    ? post.description.substring(0, 120) + "..."
    : post.description.substring(0, 120);

  const name =
    post.name.length > 20
      ? post.name.substring(0, 20) + "..."
      : post.name.substring(0, 20);
  return (
    <>
      <Card
        className='post-card'
        style={{
          boxShadow: "none",
          height: "100%",
          marginBottom: 20,
          minHeight: "272px",
        }}
        link
      >
        <Image
          wrapped
          ui={false}
          src={
            post.pictures[0] && "data:image/png;base64," + post.pictures[0].file
          }
          onClick={() => props.history.push("/post/" + post.postId)}
        />
        <Card.Content
          style={{ paddingBottom: 0 }}
          onClick={() => props.history.push("/post/" + post.postId)}
        >
          <Card.Header style={{ color: "#6bbeba" }}>{name}</Card.Header>
          <Card.Meta style={{ color: "grey" }}>
            {TimeAgo(post.datetime)}
          </Card.Meta>
          <Card.Description style={{ color: "white" }}>
            {content}
          </Card.Description>
        </Card.Content>
        {extra && (
          <Card.Content extra style={{ borderTop: "1px solid" }}>
            <div className='ui two buttons'>
              <Button
                color='teal'
                name={post.postId}
                style={{ zIndex: 20 }}
                onClick={() => props.history.push(`/edit/${post.postId}`)}
              >
                Edit
              </Button>
              <Button
                color='red'
                name={post.postId}
                style={{ zIndex: 20 }}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </div>
          </Card.Content>
        )}
        <Confirm
          open={deleteOpen}
          content={`Are you sure you want to delete Post ${post.name}?`}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={deletePostFunction}
        />
      </Card>
    </>
  );
}

export default withRouter(Cards);
