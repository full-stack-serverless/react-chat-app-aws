import React from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';

import Chat from './Chat';
import Rooms from './Rooms';
import theme from './theme'

const { primaryColor } = theme;

function Router() {
  return (
    <div>
      <HashRouter>
        <div style={topLevelContainerStyle}>
          <div style={headerStyle}>
            <a href="/" style={homeLinkStyle}>
              <p style={titleStyle}>CDK AppSync Chat</p>
            </a>
          </div>
          <nav style={navStyle}>
            <Link to="/" style={linkStyle}>
              View all rooms
            </Link>
          </nav>
        </div>
        <div style={mainViewContainerStyle}>
          <Switch>
            <Route exact path="/">
              <Rooms />
            </Route>
            <Route path="/chat/:name/:id">
              <Chat />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </div>
  )
}

function App() {
  const [user, updateUser] = React.useState(null);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('No signed in user.'));
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          return updateUser(data.payload.data);
        case 'signOut':
          return updateUser(null);
      }
    });
  }, []);
  if (user) {
    return <Router />
  }
  return <AmplifyAuthenticator />
}

const topLevelContainerStyle = {
  height: 170,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%'
}

const mainViewContainerStyle = {
  padding: '180px 30px 80px',
}

const headerStyle = {
  backgroundColor: primaryColor,
  padding: 30,
  color: 'white'
}

const titleStyle = {
  fontSize: 34,
  margin: 0,
  fontWeight: 600
}

const navStyle = {
  padding: '20px 30px',
  backgroundColor: '#ddd'
}

const homeLinkStyle = {
  textDecoration: 'none',
  color: 'white'
}

const linkStyle = {
  margin: 0,
  color: primaryColor,
  textDecoration: 'none',
  fontSize: 20
}

export default App