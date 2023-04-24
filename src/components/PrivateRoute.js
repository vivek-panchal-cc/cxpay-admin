import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const TheLayout = React.lazy(() => import('../containers/TheLayout'));

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ?  <TheLayout {...props}/>
            : <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
    )} />
)

export const LoginLessRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ?  <Redirect to={{ pathname: '/admin/dashboard', state: { from: props.location } }} />
            : <Component {...props} />
    )} />
)