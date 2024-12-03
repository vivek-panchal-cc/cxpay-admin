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

const FaqFullPost = (props) => {
  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h1 className="title">{props.question} </h1>
              </CCardHeader>
              <CCardBody>
                <h6>
                  {" "}
                  <div dangerouslySetInnerHTML={{ __html: props.answer }}></div>
                  <br />
                  <br />
                </h6>
                Sequence: {ReactHtmlParser(props.sequence)}
                <br />
                Created At: {moment(props.date).format("LL")}
              </CCardBody>
              <CCardFooter>
                <CTooltip content={globalConstants.BACK_MSG}>
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/faq"
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

export default FaqFullPost;
