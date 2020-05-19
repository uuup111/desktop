import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/layout/layout'
import Profile from './components/profile/profile'
import ProfileContent from './components/profile/content'
import Welcome from './components/welcome/welcome'
import Workspace from './components/workspace/workspace'
import WorkspaceContent from './components/workspace/content'
import Create from './components/create/create'
import P2P from '@p2pcommons/sdk-js'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { remote } from 'electron'

const showError = message =>
  window.alert(
    'An unknown error has happened.\n\n' +
      'Please send a screenshot of this window alongside a description of what ' +
      'you were doing to feedback@libscie.org.\n\n' +
      message
  )

if (remote.app.isPackaged) {
  window.onerror = (_, __, ___, ____, err) => showError(err.stack)
  window.onunhandledrejection = ev => showError(ev.reason.stack)
}

const p2p = new P2P()

const Container = ({ children }) => (
  <Router>
    <Layout>{children}</Layout>
  </Router>
)

const App = () => {
  const [profile, setProfile] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const profiles = await p2p.listProfiles()
      const profile = profiles.find(profile => profile.metadata.isWritable)
      if (profile) setProfile(profile)
      setLoading(false)
    })()
  }, [])

  if (loading) return <Container />
  if (!profile) {
    return (
      <Container>
        <Welcome p2p={p2p} setProfile={setProfile} />
      </Container>
    )
  }

  return (
    <Container>
      <Switch>
        <Route path='/' exact>
          <Workspace p2p={p2p} />
        </Route>
        <Route path='/content/:key'>
          <WorkspaceContent
            p2p={p2p}
            profile={profile}
            setProfile={setProfile}
          />
        </Route>
        <Route path='/create/:parentUrl?'>
          <Create p2p={p2p} profile={profile} />
        </Route>
        <Route path='/profile' exact>
          <Profile p2p={p2p} profile={profile} setProfile={setProfile} />
        </Route>
        <Route path='/profile/:key'>
          <ProfileContent p2p={p2p} profile={profile} setProfile={setProfile} />
        </Route>
      </Switch>
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
