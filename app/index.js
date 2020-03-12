import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/layout/layout'
import Profile from './components/profile/profile'
import Welcome from './components/welcome/welcome'
import P2P from '@p2pcommons/sdk-js'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

const p2p = new P2P()

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

  if (loading) return <Layout />
  if (!profile)
    return (
      <Layout>
        <Welcome p2p={p2p} setProfile={setProfile} />
      </Layout>
    )

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path='/'>
            <Profile p2p={p2p} profile={profile} />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
