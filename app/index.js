import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/layout/layout'
import Profile from './components/profile/profile'
import Welcome from './components/welcome/welcome'
import P2P from '@p2pcommons/sdk-js'

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

  return (
    <Layout>
      {!loading &&
        (profile ? <Profile p2p={p2p} profile={profile} /> : <Welcome />)}
    </Layout>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
