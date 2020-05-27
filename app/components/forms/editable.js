import React, { Fragment, useRef, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { gray, yellow, green } from '../../lib/colors'
import { Textarea } from './forms'

const saved = keyframes`
  0% {
    border-left-color: transparent;
  }
  50% {
    border-left-color: ${green};
  }
  100% {
    border-left-color: transparent;
  }
`
const StyledDescription = styled.div`
  position: absolute;
  left: 11rem;
  top: calc(4rem - 4px);
  right: 146px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  border-left: 2px solid transparent;
  padding-left: 0.5rem !important;
  margin-left: calc(-0.5rem - 2px) !important;
  transition: border-left-color 1s;
  ${props =>
    props.isEmpty &&
    css`
      color: ${gray};
      :hover {
        cursor: text;
      }
    `}
  ${props =>
    props.isEditing &&
    css`
      border-left-color: ${yellow};
    `}
  ${props =>
    props.isSaving &&
    css`
      border-left-color: transparent;
    `}
  ${props =>
    props.isSaved &&
    css`
      animation: ${saved} 2s linear;
    `}
`
const StyledTextarea = styled(Textarea)`
  height: 4.5rem;
  border: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  resize: none;
`

export const Description = ({ isEditing, isSaving, isSaved, value, onClick, onChange, isFocused }) => {
  const textareaRef = useRef()

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.focus()
  }, [isFocused])

  return (
    <StyledDescription
      isEditing={isEditing}
      isSaving={isSaving}
      isSaved={isSaved}
      isEmpty={value.length === 0}
      onClick={onClick}
    >
      {isEditing ? (
        <StyledTextarea
          defaultValue={value}
          onChange={onChange}
          ref={textareaRef}
        />
      ) : value ? (
        value.split('\n').map((line, index) => (
          <Fragment key={index}>
            {line}
            <br />
          </Fragment>
        ))
      ) : (
        'Add a description…'
      )}
    </StyledDescription>
  )
}