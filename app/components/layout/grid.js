import styled from 'styled-components'
import { black, purple, white, gray } from '../../lib/colors'

const rowHeight = 64

export const Cell = styled.div`
  border-right: 2px solid ${purple};
  padding: 0 32px;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  text-align: center;
`
export const Row = styled.div`
  border-top: ${props => (props.noBorderTop ? 0 : 2)}px solid ${purple};
  border-bottom: 2px solid ${purple};
  height: ${rowHeight}px;
  white-space: nowrap;
  line-height: ${rowHeight}px;
`
export const Button = styled(Cell).attrs({
  as: 'button'
})`
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
  height: 64px;
  border: 2px solid ${purple};
  border-color: ${props => props.color || purple};
  color: ${white};
  margin-right: 16px;
  min-width: 128px;

  :hover {
    color: ${white};
    background-color: ${props =>
      props.emphasis === 'top'
        ? props.disabled
          ? gray
          : black
        : props.color || purple};
    path {
      fill: ${white};
    }
  }

  :active {
    background-color: ${props =>
      props.emphasis === 'top' ? props.color || purple : black};
  }

  ${Row} > & {
    border-left-width: 0px;
    border-top-width: 0px;
    border-bottom-width: 0px;
    border-color: ${purple};
    color: ${props => props.color || white};
    margin-right: 0;
    :hover {
      color: ${white};
    }
    :active {
      color: ${props => props.color || white};
    }
  }
`
export const StickyRow = styled(Row)`
  position: sticky;
  top: ${props => props.top}px;
  background-color: ${black};
  z-index: 1;
`
export const TopRow = styled(StickyRow)`
  top: 48px;

  :before {
    content: '';
    position: absolute;
    top: -50px;
    width: 100%;
    height: 48px;
    background-color: ${black};
  }
`
export const Title = styled(Cell)`
  font-size: 40px;
`
