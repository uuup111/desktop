import React from 'react'
import styled from 'styled-components'
import { purple, black, white } from '../../lib/colors'
import CaretDown from '../icons/caret-down-1rem.svg'
import { Title } from '../layout/grid'

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  line-height: 1;
`
export const Input = styled.input`
  border: 2px solid ${purple};
  background-color: ${black};
  font-size: 2rem;
  padding: 11px .5rem;
  margin-bottom: 1rem;
  color: ${white};
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: Roboto;
  letter-spacing: 0.05rem;

  ${Title} > & {
    border: 0;
    display: inline-block;
    font-size: 40px;
    padding: 0;
    outline: 0;
  }
`

const SelectContainer = styled.div`
  position: relative;
`
const SelectElement = styled.select`
  display: block;
  background-color: ${black};
  color: ${white};
  border: 2px solid ${purple};
  font-size: ${props => (props.large ? 1.5 : 1)}rem;
  width: 100%;
  max-width: 661px;
  height: ${props => (props.large ? 2.5 : 2)}rem;
  border-radius: 0;
  appearance: none;
  margin-bottom: 2rem;
  font-family: Roboto;
  padding-left: .5rem;
  letter-spacing: .05em;
`
const SelectCaret = styled(CaretDown)`
  position: absolute;
  right: .5rem;
  top: 5px;
`
const SelectCaretLarge = styled(SelectCaret)`
  top: 10px;
`
export const Select = ({ large, ...props }) => (
  <SelectContainer>
    <SelectElement large={large} {...props} />
    {large ? <SelectCaretLarge /> : <SelectCaret />}
  </SelectContainer>
)

export const Textarea = styled.textarea`
  border: 2px solid ${purple};
  background-color: ${black};
  font-size: 1rem;
  padding: .5rem;
  margin-bottom: 2rem;
  color: ${white};
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 12rem;
  font-family: Roboto;
  letter-spacing: inherit;
  line-height: inherit;
`
