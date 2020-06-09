import React, { Fragment, useRef, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { gray, yellow, green, red } from '../../lib/colors'
import { Textarea, Input, Select } from './forms'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'

const saved = keyframes`
  0% {
    border-left-color: transparent !important;
  }
  50% {
    border-left-color: ${green} !important;
  }
  100% {
    border-left-color: transparent !important;
  }
`
const indicatorBorder = css`
  border-left: 2px solid transparent !important;
  padding-left: 0.5rem !important;
  margin-left: calc(-0.5rem - 2px) !important;
  transition: border-left-color 1s !important;
  ${props =>
    props.isEditing &&
    css`
      border-left-color: ${yellow} !important;
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
const StyledDescription = styled.div`
  ${props =>
    props.maxRows &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${props.maxRows};
    `}
  ${props =>
    props.isEmpty &&
    css`
      color: ${gray};
      :hover {
        cursor: text;
      }
    `}
  ${indicatorBorder};
`
const StyledTextarea = styled(Textarea)`
  /*height: 4.5rem;*/
  border: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  resize: none;
`

export const Description = ({
  isEditing,
  isSaving,
  isSaved,
  value,
  onClick,
  onChange,
  isFocused,
  maxRows,
  ...props
}) => {
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
      maxRows={maxRows}
      {...props}
    >
      {isEditing ? (
        <StyledTextarea
          defaultValue={value}
          onChange={onChange}
          ref={textareaRef}
          maxRows={maxRows}
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

const Indicator = styled.div`
  border-left: 2px solid transparent;
  height: 1.125em;
  display: inline-block;
  position: relative;
  left: -0.5rem;
  top: 0.5rem;
  margin-left: -2px;
  transition: border-left-color 1s;

  ${props =>
    props.isEditing &&
    css`
      border-left-color: ${yellow};
    `}
  ${props =>
    props.isInvalid &&
    css`
      border-left-color: ${red};
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
const StyledTitle = styled.div`
  font-size: 2rem;
`
const StyledInput = styled(Input)`
  border: 0;
  display: inline-block;
  padding: 0;
  margin: 0;
  outline: 0;
  font-size: inherit;
`
const SubtypeContainer = styled.div`
  ${indicatorBorder};
`

export const Title = ({
  isEditing,
  isSaving,
  isSaved,
  isInvalid,
  value,
  onChange,
  ...props
}) => (
  <StyledTitle {...props}>
    <Indicator
      isEditing={isEditing}
      isSaving={isSaving}
      isSaved={isSaved}
      isInvalid={isInvalid}
    />
    {isEditing ? (
      <StyledInput defaultValue={value} onChange={onChange} />
    ) : (
      value
    )}
  </StyledTitle>
)

export const Subtype = ({
  isEditing,
  isSaving,
  isSaved,
  value,
  onChange,
  ...props
}) => (
  <SubtypeContainer
    isEditing={isEditing}
    isSaving={isSaving}
    isSaved={isSaved}
  >
    {isEditing ? (
      <Select
        defaultValue={value}
        onChange={onChange}
        {...props}
      >
        {Object.entries(subtypes).map(([id, text]) => (
          <option value={id} key={id}>
            {text}
          </option>
        ))}
      </Select>
    ) : (
      subtypes[value] || 'Content'
    )}
  </SubtypeContainer>
)