import React from "react";
import "./page.css";
import moment from "moment";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter,
  CLink,
  CTooltip,
} from "@coreui/react";
import ReactHtmlParser from "react-html-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "constants/admin/global.constants";

const Fullpage = (props) => {
  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h1 className="title">{props.title} </h1>
              </CCardHeader>
              <CCardBody>
                <h2>{props.meta_title}</h2>
                <h6>
                  {" "}
                  {props.desc} -{moment(props.date).format("LL")}
                </h6>

                {ReactHtmlParser(props.body)}
              </CCardBody>
              <CCardFooter>
                <CTooltip content={globalConstants.BACK_MSG}>
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/cms_pages"
                  >
                    {" "}
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
                  </CLink>
                </CTooltip>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Fullpage;
