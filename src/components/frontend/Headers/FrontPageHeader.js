import React from 'react';
import { Container } from "reactstrap";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;

function FrontPageHeader() {
  let pageHeader = React.createRef();
  const banners = useSelector(state => state.banners.banners);
  React.useEffect(() => {
    if (window.innerWidth < 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });
  var banner_image = process.env.REACT_APP_DEFAULT_BANNER_IMAGE;
  var banner_title = '';
  if (banners !== null && banners !== undefined && banners.media_id !== undefined) {
    if (banners.media_id !== null) {
      banner_image = 'media/' + banners.media_id.media_path;
    }
    banner_title = banners.title;
  }
  const location = useLocation();
  let banner_class = 'page-header page-header-xs';
  if (location.pathname === '/') {
    banner_class = 'page-header section-dark'
  }
  return (
    <>
      <div
        className={banner_class}
        style={{
          backgroundImage:
            "url(" + API_URL + 'uploads/' + banner_image + ")",
        }}
      >
        <div className="filter" />
        <div className="content-center">
          <Container>
            <div className="title-brand">
              <h1 className="presentation-title">{banner_title}</h1>
              <div className="fog-low">
                <img alt="..." src={require("assets/img/fog-low.png").default} />
              </div>
              <div className="fog-low right">
                <img alt="..." src={require("assets/img/fog-low.png").default} />
              </div>
            </div>
          </Container>
        </div>
        <div
          className="moving-clouds"
          style={{
            backgroundImage: "url(" + require("assets/img/clouds.png").default + ")",
          }}
        />
      </div>
    </>
  );
}

export default FrontPageHeader;
