import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CSubheader,
  CBreadcrumbRouter,
  CBreadcrumb,
  CBreadcrumbItem,
  CLink
} from '@coreui/react'
import { useLocation } from 'react-router-dom';

// routes config
import routes from '../routes'

import {
  TheHeaderDropdown,
  LoginUserName,
} from './index'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.theme.sidebarShow)
  const pathName = useLocation().pathname;
  const paths = [];
  let BreadcumbName = [];
  
  // Create custom Breadcumb for menun Item
  if (pathName.indexOf("/menu_management/menu_items/edit/") !== -1) {
    pathName.split('/').reduce((prev, curr) => {
      const currPath = `${prev}/${curr}`
      paths.push(currPath)
      return currPath
    })
    paths.splice(2, 2);
    paths[2] = paths[2].replace('/edit/','/');    
    paths.splice(3, 1);
    BreadcumbName = ['Home','Menu','Menu Items Management','Edit'];
  }
  // Create custom Breadcumb for menun Item
  if (pathName.indexOf("/menu_management/menu_items/add/") !== -1) {
    pathName.split('/').reduce((prev, curr) => {
      const currPath = `${prev}/${curr}`
      paths.push(currPath)
      return currPath
    })
    paths.splice(3, 1);
    paths.splice(2, 1);
    paths[2] = paths[2].replace('/add/','/');    
    BreadcumbName = ['Home','Menu','Menu Items Management','Add'];
  }

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <img src={require('assets/img/logo-1.png').default} className='cc-logo-styles-mobile' />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >

        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">

        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">

        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <LoginUserName />
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        {paths.length === 0 &&
          <CBreadcrumbRouter
            className="border-0 c-subheader-nav m-0 px-0 px-md-3"
            routes={routes}
          />
        }

        {paths.length > 0 && 
          <CBreadcrumb className="border-0 c-subheader-nav m-0 px-0 px-md-3" >
            { 
              paths.map((u, index) => (
                <CBreadcrumbItem key={index}><CLink to={u} >{BreadcumbName[index]}</CLink></CBreadcrumbItem>
              ))
            }
            <CBreadcrumbItem active>{BreadcumbName[paths.length]}</CBreadcrumbItem>
          </CBreadcrumb>
        }
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
