/*eslint-disable*/
import React from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

// reactstrap components
import { Row, Container,NavLink } from "reactstrap";

function FrontFooter() {
  // const menus = useSelector(state => state.menus.menus.footer_menu);
  const menus = useSelector(state => (state.menus.menus !== undefined )?state.menus.menus.footer_menu:undefined);
  
  const Footer_text = useSelector(state =>(state.sitedata.sitedata!== undefined )? state.sitedata.sitedata.footer_text:undefined);

  //console.log(Footer_text);

  return (
    <footer className="footer footer-black footer-white">
      <Container>
        <Row>
          <nav className="footer-nav">
          <ul>
              {menus !== undefined &&
                menus.map((menu, index) => (
                  <li key={index}>
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
                      <NavLink to={'/info/' + menu.cms_pages[0].slug} tag={Link}>
                        {menu.menu_title}
                      </NavLink>
                    }
                  </li>
                ))
              }
            </ul>
          </nav>
          <div className="credits ml-auto">
            <span className="copyright">
              © {new Date().getFullYear()}, made with{" "}
               by <a href="https://communicationcrafts.com" target="_blank">{Footer_text}</a>

            </span>
          </div>
        </Row>
      </Container>
    </footer>
  );
}

export default FrontFooter;