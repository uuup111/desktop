import styled from 'styled-components'
import { black, green, purple, white } from '../../lib/colors'

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
`
export const Button = styled(Cell).attrs({
  as: 'button'
})`
  border-left-width: 0px;
  border-top-width: 0px;
  border-bottom-width: 0px;
  background-color: ${black};
  vertical-align: top;

  font-size: 16px;
  color: ${green};

  :hover {
    color: ${white};
    background-color: ${green};
  }

  :active {
    background-color: ${black};
  }
`
