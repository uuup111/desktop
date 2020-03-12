import React from 'react'
import styled from 'styled-components'
import Logo from './logo.svg'
import { white, purple, black } from '../../lib/colors'
import { Row, Button } from '../layout/grid'
import { NavLink } from 'react-router-dom'

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
  background-color: ${black};
  text-align: left;
  width: 100%;
  padding-left: 12.5%;
  :hover {
    background-color: ${purple};
  }
  display: block;

  .active > & {
    background-color: ${purple};
    :active {
      background-color: ${purple};
    }
  }
  :active {
    background-color: ${black};
  }
`
const StyledNavLink = styled(NavLink)`
  text-decoration: none;
`

const Menu = () => {
  return (
    <Container>
      <StyledLogo />
      <StyledRow>
        <StyledNavLink to='/' exact>
          <StyledButton>Workbench</StyledButton>
        </StyledNavLink>
        <StyledNavLink to='/profile'>
          <StyledButton>Profile</StyledButton>
        </StyledNavLink>
      </StyledRow>
    </Container>
  )
}

export default Menu
