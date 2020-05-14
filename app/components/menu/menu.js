import React from 'react'
import styled from 'styled-components'
import Logo from './logo.svg'
import { white, purple, black } from '../../lib/colors'
import { Row, Button } from '../layout/grid'
import { NavLink, useHistory } from 'react-router-dom'

const Container = styled.div`
  width: 8rem;
  border-right: 2px solid ${purple};
  padding-top: 3rem;
  position: fixed;
  height: 100%;
  top: 0;
  text-align: center;
  box-sizing: border-box;
`
const StyledLogo = styled(Logo)`
  margin-bottom: 2rem;
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
  border-left-width: 0;
  border-top-width: 0;
  :hover {
    background-color: ${purple};
    color: ${white};
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
const isWorkbench = location =>
  /^\/$|^\/(content\/|create)/.test(location.pathname)

const Menu = () => {
  const history = useHistory()

  return (
    <Container>
      <StyledLogo onClick={() => history.push('/')} />
      <StyledRow>
        <StyledNavLink to='/' isActive={(_, location) => isWorkbench(location)}>
          <StyledButton>Workspace</StyledButton>
        </StyledNavLink>
        <StyledNavLink to='/profile'>
          <StyledButton>Profile</StyledButton>
        </StyledNavLink>
      </StyledRow>
    </Container>
  )
}

export default Menu
