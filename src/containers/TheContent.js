import React, { Suspense,useEffect  } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
import { _canAccess } from '../_helpers/common-utility';
import { userService } from '../services/admin/user.service';
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} checkApiAcl={userService.getPermission()} module_name={route.module_name} action={route.action} _renderAccess={_canAccess(route.module_name,route.action)} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/admin/" to="/admin/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
