import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/layout/layout'
import Profile from './components/profile/profile'

const App = () => (
  <Layout>
    <Profile />
  </Layout>
)

ReactDOM.render(<App />, document.getElementById('root'))
