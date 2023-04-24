import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { capitalize } from '../_helpers/common-utility';
import { useSelector } from 'react-redux';


const LoginUserName = (props) => {
  useSelector(state => state.authentication.user.name);

    return (
    <>
        Hi {(props.user.name === undefined)?'':capitalize(props.user.name)}
    </>
  )
}


function mapStateToProps(state) {
    let user = state.authentication.user;
    return {
        user:user
    };
  }
  
  export  default connect(mapStateToProps)(LoginUserName);
