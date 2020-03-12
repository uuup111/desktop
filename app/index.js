import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/layout/layout'
import Profile from './components/profile/profile'
import Welcome from './components/welcome/welcome'
import Workbench from './components/workbench/workbench'
import P2P from '@p2pcommons/sdk-js'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

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
          <Workbench p2p={p2p} />
        </Route>
        <Route path='/profile'>
          <Profile p2p={p2p} profile={profile} />
        </Route>
      </Switch>
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
