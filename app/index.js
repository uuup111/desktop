import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Container = styled.div`
  color: purple;
  background-color: white;
`

const App = () => <Container>Hi!</Container>

ReactDOM.render(<App />, document.getElementById('root'))
