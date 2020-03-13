import styled from 'styled-components'
import { purple, black, white } from '../lib/colors'

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 9px;
  display: block;
`
export const Input = styled.input`
  border: 2px solid ${purple};
  background-color: ${black};
  font-size: 32px;
  padding: 7px 17px;
  margin-bottom: 16px;
  color: ${white};
  display: block;
  width: 440px;
`
export const Select = styled.select`
  display: block;
  background-color: ${black};
  color: ${white};
  border-color: ${purple};
  font-size: 32px;
  width: 100%;
  max-width: 640px;
  height: 64px;
  /* border-radius: 0;
  appearance: none; */
  margin-bottom: 33px;
`
