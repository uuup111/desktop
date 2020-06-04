import React, { useState } from 'react'
import styled from 'styled-components'
import { black, red, yellow, white } from '../../lib/colors'
import { Input } from './forms'

const Container = styled.div`
  position: relative;
`
const CharacterCounter = styled.div`
  text-align: right;
  color: ${props => props.color};
  margin-bottom: 2px;
`
const TitleInput = styled(Input).attrs({
  required: true,
  pattern: '.{1,300}',
  type: 'text',
  name: 'title'
})`
  margin-bottom: .25rem;
`
export default ({ onIsValid = () => {}, ...props }) => {
  const [charCount, setCharCount] = useState(0)

  let color
  if (charCount === 0) {
    color = black
  } else if (charCount > 300) {
    color = red
  } else if (charCount >= 250) {
    color = yellow
  } else {
    color = white
  }

  return (
    <Container>
      <TitleInput
        {...props}
        onChange={e => {
          const {
            target: {
              value: { length: count }
            }
          } = e
          setCharCount(count)
          onIsValid(count > 0 && count <= 300)
          if (props.onChange) props.onChange(e)
        }}
      />
      <CharacterCounter color={color}>{charCount}/300</CharacterCounter>
    </Container>
  )
}
