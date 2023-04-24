import React, { useEffect } from 'react';
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/paper-kit.css";
import "../../../assets/demo/demo.css";
import { useDispatch } from 'react-redux';
import { layoutActions } from '../../../actions/frontend';

const FrontNavbar = React.lazy(() => import('../../../components/frontend/Navbars/FrontNavbar.js'));
const FrontPageHeader = React.lazy(() => import('../../../components/frontend/Headers/FrontPageHeader.js'));
const FrontFooter = React.lazy(() => import('../../../components/frontend/Footers/FrontFooter.js'));
const TheFrontContent = React.lazy(() => import('../../../components/frontend/TheFrontContent'));

function TheFrontLayout() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(layoutActions.getMenus());
    dispatch(layoutActions.getBanners());
    dispatch(layoutActions.getsitedata());
  });

  return (
    <>
      <FrontNavbar />
      <FrontPageHeader />
      <TheFrontContent />
      <FrontFooter />
    </>
  );
}

export default TheFrontLayout;
