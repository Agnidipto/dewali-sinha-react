import React, { useState } from "react";
import { Card, Placeholder } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import deletePost from "./CardService";
import TimeAgo from "../../Utility/TimeAgo";

import ErrorFunction from "../ErrorFunction";

function CardLoading(props) {
  return (
    <>
      <Card
        className='post-card'
        style={{
          boxShadow: "none",
          height: "100%",
          minHeight: "272px",
          marginBottom: 20,
        }}
      >
        <Placeholder inverted style={{ height: "100%" }}>
          <Placeholder.Image style={{ height: "100%" }} />
        </Placeholder>

        {props.extra && (
          <Card.Content extra style={{ borderTop: "1px solid" }}></Card.Content>
        )}
      </Card>
    </>
  );
}

export default CardLoading;
