import React, { Suspense } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import Landing from './routes/Landing/Landing'
import { useUser } from './auth/UserProvider'
import withGuardedRoute from './auth/withGuardedRoute'
import { hasRoles } from './auth/helpers'
import Fallback from './components/Fallback'
import { Helmet } from 'react-helmet'


const Admin = React.lazy(() => import('./routes/Admin/Admin'))
const Profile = React.lazy(() => import('./routes/Profile/Profile'))


function App() {
  const { user } = useUser()
  const UserRoute = withGuardedRoute(user)
  const AdminRoute = withGuardedRoute(user && hasRoles(user, 'admin'))

  return (
    <div className="App">
      <Helmet>
        <title>tpadjen.dev</title>
      </Helmet>
      <Router>
        <Suspense fallback={<Fallback />}>
          <Switch>
            <Route path="/" component={Landing} exact />
            <AdminRoute path='/admin' component={Admin} />
            <UserRoute path="/profile" component={Profile} />
            <Redirect from="*" to="/" />
          </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
