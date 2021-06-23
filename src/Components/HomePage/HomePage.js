import React, { useState, useEffect } from "react";
import { Parallax, Background } from "react-parallax";
import Menubar from "../../Containers/Menubar/Menubar";
import Fade from "react-reveal/Fade";
import { Grid, Image } from "semantic-ui-react";
import getWebPictureByName, {
  getWebContentByName,
  getAllTypes,
} from "./HomePageService";
import ErrorFunction from "../ErrorFunction";
import ErrorModal from "../Modals/ErrorModal";
import TypeSegment from "./TypeSegment";

import Homepage from "../../Utility/Pictures/homepage.jpg";
import homepage1 from "../../Utility/Pictures/homepage1.jpg";
import dewali from "../../Utility/Pictures/dewali.jpg";

function HomePage(props) {
  const image1 = Homepage;
  const image2 =
    "https://img00.deviantart.net/2bd0/i/2009/276/c/9/magic_forrest_wallpaper_by_goergen.jpg";
  const image3 =
    "https://brightcove04pmdo-a.akamaihd.net/5104226627001/5104226627001_5297440765001_5280261645001-vs.jpg?pubId=5104226627001&videoId=5280261645001";
  const image4 =
    "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/empire-state-building-black-and-white-square-format-john-farnan.jpg";

  const insideStyles = {
    background: "none",
    color: "white",
    fontSize: "50px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  const [error, setError] = useState({ open: false, message: null });

  const [displayImage, setDisplayImage] = useState(null);
  const [about, setAbout] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getWebPictureByName("Display Picture")
      .then((res) => setDisplayImage(res.data.file.file))
      .catch((err) => setError(ErrorFunction(err)));
    getWebContentByName("Main Page 1")
      .then((res) => {
        setAbout(res.data.content);
      })
      .catch((err) => setError(ErrorFunction(err)));
    getAllTypes()
      .then((res) => {
        console.log(res.data);
        setTypes(res.data);
      })
      .catch((err) => {
        setError(ErrorFunction(err));
      });
  }, []);
  return (
    <>
      <div style={{ minHeight: "150vh" }}>
        <Menubar text='Dewali Sinha' toggleSideBar={props.toggleSideBar} />
        <Parallax
          bgImage={image1}
          strength={400}
          bgImageStyle={{ opacity: ".7" }}
        >
          <div style={{ height: "100vh" }}>
            <div style={insideStyles}>
              <Fade bottom>
                <h1 style={{ fontSize: 50 }}>Welcome to my World!</h1>
              </Fade>
            </div>
          </div>
        </Parallax>
        <div>
          <Fade bottom>
            <Grid>
              <Grid.Row style={{ padding: 60 }}>
                <Grid.Column
                  computer={6}
                  tablet={16}
                  style={{ paddingBottom: 20, paddingTop: 20 }}
                >
                  <Image
                    circular
                    centered
                    // src={"data:image/png;base64," + displayImage}
                    src={dewali}
                    style={{ height: 200, width: 200 }}
                  />
                </Grid.Column>
                <Grid.Column computer={10} tablet={16}>
                  <div
                    style={{
                      position: "relative",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <p
                      className='cursive light-teal-text'
                      style={{ fontSize: 50, margin: 0 }}
                    >
                      Hello,{" "}
                    </p>
                    <p
                      style={{
                        fontSize: 20,
                      }}
                    >
                      My name is Dewali Sinha. I am a mom and homemaker by
                      profession, and creating art is my hobby. Welcome to my
                      humble abode, where all of my imaginations and creativity
                      thrive. If you like what you see, I will be very grateful
                      that I have produced something, that was worth your time!
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Fade>
        </div>
        <div style={{ marginBottom: 20 }}>
          <Parallax
            bgImage={homepage1}
            // blur={{ min: -1, max: 6 }}
            strength={400}
            bgImageSize={"10"}
            bgImageStyle={{
              opacity: ".7",
              filter: "blur(2px)",
              webkitFilter: "blur(2px)",
            }}
          >
            <div style={{ height: "50vh" }}>
              <div style={insideStyles}>
                <Fade bottom>
                  <h1 style={{ fontSize: 50 }}>My Works!</h1>
                </Fade>
              </div>
            </div>
          </Parallax>
        </div>
        <div>
          {types.map((type) => (
            <Fade bottom>
              <TypeSegment type={type} setError={setError} />
            </Fade>
          ))}
        </div>
      </div>

      <ErrorModal
        open={error.open}
        message={error.message}
        setOpen={setError}
      />
    </>
  );
}

export default HomePage;
