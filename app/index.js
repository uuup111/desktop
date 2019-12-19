import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

const Container = styled(animated.div)`
  color: purple;
  background-color: white;
`

const App = () => {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } })
  return <Container style={props}>Hi!</Container>
}

ReactDOM.render(<App />, document.getElementById('root'))
