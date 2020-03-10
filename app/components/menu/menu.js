import React from 'react'
import styled from 'styled-components'
import Logo from './logo.svg'
import { white, purple } from '../../lib/colors'
import { Row, Button } from '../layout/grid'

const Container = styled.div`
  width: 128px;
  border-right: 2px solid ${purple};
  padding-top: 48px;
  position: fixed;
  height: 100%;
  top: 0;
  text-align: center;
  box-sizing: border-box;
`
const StyledLogo = styled(Logo)`
  margin-bottom: 32px;
`
const StyledRow = styled(Row)`
  text-align: left;
`
const StyledButton = styled(Button)`
  color: ${white};
  background-color: ${purple};
  text-align: left;
  width: 100%;
  padding-left: 12.5%;
  :hover {
    background-color: ${purple};
  }
`

const Menu = () => (
  <Container>
    <StyledLogo />
    <StyledRow>
      <StyledButton disabled>Profile</StyledButton>
    </StyledRow>
  </Container>
)

export default Menu
