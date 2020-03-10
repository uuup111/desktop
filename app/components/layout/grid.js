import styled from 'styled-components'
import { black, green, purple, white, gray } from '../../lib/colors'

const rowHeight = 62

export const Row = styled.div`
  border-top: 2px solid ${purple};
  border-bottom: 2px solid ${purple};
  height: ${rowHeight}px;
  white-space: nowrap;
`
export const Cell = styled.div`
  border-right: 2px solid ${purple};
  padding: 0 32px;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  min-width: 128px;
  text-align: center;
`
export const Button = styled(Cell).attrs({
  as: 'button'
})`
  border-left-width: 0px;
  border-top-width: 0px;
  border-bottom-width: 0px;
  background-color: ${props =>
    props.emphasis === 'top'
      ? props.disabled
        ? gray
        : props.color || purple
      : black};
  vertical-align: top;
  font-family: Roboto;
  letter-spacing: 0.05em;

  font-size: 16px;
  color: ${props => (props.emphasis === 'top' ? white : green)};
  height: 64px;

  :hover {
    color: ${white};
    background-color: ${props =>
      props.emphasis === 'top' ? (props.disabled ? gray : black) : green};
  }

  :active {
    background-color: ${props =>
      props.emphasis === 'top' ? props.color || purple : black};
  }
`
