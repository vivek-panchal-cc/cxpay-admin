import React from "react";
import { Link } from "react-router-dom";
// nodejs library that concatenates strings
import classnames from "classnames";
import { useSelector } from 'react-redux';

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";

const API_URL = process.env.REACT_APP_API_URL;

function FrontNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [navbarCollapse, setNavbarCollapse] = React.useState(false);
  const menus = useSelector(state => (state.menus.menus !== undefined )?state.menus.menus.main_menu:undefined);
  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
  };

  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 299 ||
        document.body.scrollTop > 299
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 300 ||
        document.body.scrollTop < 300
      ) {
        setNavbarColor("navbar-transparent");
      }
    };

    window.addEventListener("scroll", updateNavbarColor);

    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  const Site_Logo = useSelector(state =>(state.sitedata.sitedata!== undefined )? state.sitedata.sitedata.site_logo:undefined);
  const styles= {
    "maxWidth":"100px"
  }

  return (

   

    <Navbar
      className={classnames("fixed-top", navbarColor)}
      color-on-scroll="300"
      expand="lg"
    >
      <Container>
        <div className="navbar-translate">
          <NavbarBrand
            data-placement="bottom"
            to="/"
            title="Coded by Communicaton Crafts"
            tag={Link}

           
          >

         <img src={`${ API_URL+'uploads/'+Site_Logo}`} style={styles} alt='Logo'/>
          
          </NavbarBrand>
          <button
            aria-expanded={navbarCollapse}
            className={classnames("navbar-toggler navbar-toggler", {
              toggled: navbarCollapse,
            })}
            onClick={toggleNavbarCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className="justify-content-end"
          navbar
          isOpen={navbarCollapse}
        >
          <Nav navbar>
            {menus !== undefined &&
              menus.map((menu, index) => (
                <NavItem key={index}>
                  { menu.menu_types === 'custom' &&
                    <NavLink to={menu.menu_url} tag={Link}>
                      {menu.menu_title}
                    </NavLink>
                  }
                  { menu.menu_types === 'cms' 
                  && menu.cms_pages.length > 0 
                  && menu.cms_pages[0].slug !== undefined 
                  && menu.cms_pages[0].slug !== '' 
                  &&
                    <NavLink to={'/info/'+menu.cms_pages[0].slug} tag={Link}>
                       {menu.menu_title}
                    </NavLink>
                  }
                </NavItem>
              ))
            }
          </Nav>
        </Collapse>
      </Container>
    </Navbar >
  );
}

export default FrontNavbar;
