import React from 'react'
import './page.css'
import moment from 'moment'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter
} from '@coreui/react'
import ReactHtmlParser from 'react-html-parser';
 



const Fullpage =(props)=>{
    
    return (<>
   
    <CContainer fluid>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
           <h1 className="title">{props.title} </h1>
          </CCardHeader>
          <CCardBody>
          <h2>{props.meta_title}</h2>
      <h6> {props.desc } -{moment(props.date).format('LL')}</h6>
     
      { ReactHtmlParser(props.body)}
          </CCardBody>
          <CCardFooter>
            
          </CCardFooter>
        </CCard>
      </CCol>
      </CRow>
      </CContainer>
          </>)

}

export default Fullpage
