import styled from 'styled-components'
import { purple, black, white } from '../../lib/colors'

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 9px;
  display: block;
`
export const Input = styled.input`
  border: 2px solid ${purple};
  background-color: ${black};
  font-size: 32px;
  padding: 11px 17px;
  margin-bottom: 16px;
  color: ${white};
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: Roboto;
`
export const Select = styled.select`
  display: block;
  background-color: ${black};
  color: ${white};
  border-color: ${purple};
  font-size: ${props => (props.large ? 32 : 16)}px;
  width: 100%;
  max-width: 661px;
  height: ${props => (props.large ? 64 : 32)}px;
  /* border-radius: 0;
  appearance: none; */
  margin-bottom: 33px;
  font-family: Roboto;
`
export const Textarea = styled.textarea`
  border: 2px solid ${purple};
  background-color: ${black};
  font-size: 16px;
  padding: 7px 17px;
  margin-bottom: 16px;
  color: ${white};
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 192px;
  font-family: Roboto;
`
