import React from 'react';

const Index = React.lazy(() => import('./views/pages/frontend/index'));
const Cms_pages = React.lazy(() => import('./views/pages/frontend/cms_pages'));

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Landing', component: Index },
  { path: '/info/:cms_slug', exact: true, name: 'Cms Pages', component: Cms_pages },
];

export default routes;