import styled from 'styled-components'
import { purple, white } from '../lib/colors'

const Anchor = styled.a`
  text-decoration: none;
  border-bottom: 2px solid ${purple};
  color: ${white};
  -webkit-app-region: no-drag;

  :hover {
    background-color: ${purple};
    cursor: pointer;
  }
`

export default Anchor
