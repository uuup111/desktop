import React from 'react'
import styled from 'styled-components'
import { purple } from '../../lib/colors'
import { rgba } from 'polished'

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${rgba(purple, 0.8)};
  z-index: 2;
`

const Welcome = () => <Overlay />

export default Welcome
