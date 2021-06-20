import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
import ErrorModal from "../Modals/ErrorModal";
import ErrorFunction from "../ErrorFunction";
import MenuBar from "../../Containers/Menubar/Menubar";
import getPostById from "./PostPageService";
import { Segment, Icon, List, Image } from "semantic-ui-react";
import { Parallax, Background } from "react-parallax";
import Fade from "react-reveal/Fade";
import OnePictureDisplay from "../OnePictureDisplay";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper/core";

function PostPage(props) {
  const [post, setPost] = useState({});
  const params = useParams();
  const [id, setId] = useState(params.id);
  const [error, setError] = useState({ open: false, message: null });
  const [loading, setLoading] = useState(true);

  const [showPicture, setShowPicture] = useState(false);
  const [picture, setPicture] = useState(null);

  SwiperCore.use([Pagination, Navigation]);
  useEffect(() => {
    getPostById(id)
      .then((res) => {
        setPost(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => setError(ErrorFunction(err)));
  }, [id]);

  useEffect(() => {
    setId(params.id);
    setLoading(true);
  }, [params.id]);

  const insideStyles = {
    background: "none",
    color: "white",
    fontSize: "50px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  return (
    <>
      <MenuBar toggleSideBar={props.toggleSideBar} text={"Post " + id} />
      <div style={{ minHeight: "100vh" }}>
        {loading ? (
          <Icon loading size='huge' name='spinner' style={{ marginTop: 200 }} />
        ) : (
          <div style={{ paddingBottom: 50 }}>
            <Parallax
              bgImage={
                post.pictures[0]
                  ? "data:image/png;base64," + post.pictures[0].file
                  : null
              }
              bgImageStyle={{ opacity: 0.5 }}
              // blur={{ min: -1, max: 3 }}
              strength={500}
            >
              <div style={{ height: "80vh" }}>
                <div style={insideStyles}>
                  <Fade bottom>
                    <h1 style={{ fontSize: 50 }}>{post.name}</h1>
                  </Fade>
                </div>
              </div>
            </Parallax>
            <div
              style={{
                maxWidth: "700px",
                margin: "auto",
                padding: 30,
                textAlign: "left",
              }}
            >
              <h3>{post.description}</h3>
              {/* <h3>
                Materials Required:{" "}
                <List bulleted>
                  {post.materials.map((material) => {
                    <List.Item>{material.material}</List.Item>;
                  })}
                </List>
              </h3> */}
            </div>
            <Swiper
              // slidesPerView={1}
              spaceBetween={30}
              loop={false}
              // pagination={{
              //   clickable: true,
              // }}
              navigation={true}
              slidesPerView={"auto"}
              className='mySwiper'
            >
              {post.pictures.map((picture) => {
                return (
                  <SwiperSlide className='swiper-post'>
                    <Image
                      rounded
                      centered
                      verticalAlign='middle'
                      style={{
                        maxWidth: "700px",
                        width: "80%",
                        // maxHeight: "200px",
                      }}
                      src={"data:image/png;base64," + picture.file}
                      onClick={() => {
                        setShowPicture(true);
                        setPicture("data:image/png;base64," + picture.file);
                      }}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
      <OnePictureDisplay
        open={showPicture}
        setOpen={setShowPicture}
        picture={picture}
        heading={post.name}
      />
    </>
  );
}

export default withRouter(PostPage);
