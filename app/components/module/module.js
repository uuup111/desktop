import React from 'react'
import styled from 'styled-components'
import { purple, black, white, gray } from '../../lib/colors'
import Arrow from '../arrow.svg'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import HexPublished from './published.svg'
import HexUnpublished from './unpublished.svg'
import { useHistory, Link } from 'react-router-dom'

const Container = styled.div`
  border-bottom: 2px solid ${purple};
  padding: 32px ${props => (props.pad === 'small' ? 32 : 64)}px;
  position: relative;
  height: 296px;
  box-sizing: border-box;
`
const Attributes = styled.div`
  display: inline-block;
`
const Attribute = styled.div``
const AttributeIcon = styled.div`
  margin-top: 10px;
`
const Content = styled.div`
  position: absolute;
  left: calc(128px + ${props => (props.pad === 'small' ? 32 : 64)}px);
  top: 32px;
  right: 192px;
  bottom: 32px;
  overflow: hidden;
`
const Title = styled.div`
  font-size: 24px;
  line-height: 28px;
`
const Author = styled(Link)`
  text-decoration: none;
  color: ${white};
  border-bottom: 2px solid ${purple};
  margin: 16px 0;
  display: inline-block;
  -webkit-app-region: no-drag;

  :hover {
    background-color: ${purple};
    cursor: pointer;
  }
`
const Unpublished = styled.p`
  color: ${gray};
`
const Description = styled.div`
  overflow: hidden;
  max-height: 9em;
  :before {
    content: '';
    width: 100%;
    height: 74px;
    position: absolute;
    left: 0;
    bottom: 0;
    background: linear-gradient(transparent, ${black});
  }
`
const RightArrow = styled(Arrow)`
  transform: rotate(90deg);
  position: absolute;
  right: 32px;
  top: calc(296px / 2 - 32px / 2);
`

const Module = ({
  subtype,
  version,
  title,
  authors,
  description,
  isPublished,
  pad,
  to
}) => {
  const history = useHistory()

  return (
    <Container
      pad={pad}
      onClick={e => {
        if (e.target.tagName !== 'A') history.push(to)
      }}
    >
      <Attributes>
        <Attribute>{subtypes[subtype] || 'Unknown'}</Attribute>
        <Attribute>v{version}</Attribute>
        <AttributeIcon>
          {isPublished ? <HexPublished /> : <HexUnpublished />}
        </AttributeIcon>
      </Attributes>
      <Content pad={pad}>
        <Title>{title}</Title>
        {isPublished ? (
          authors.map(author => (
            <Author key={author} to='/profile'>
              {author}
            </Author>
          ))
        ) : (
          <Unpublished>not yet published...</Unpublished>
        )}
        <Description>{description}</Description>
      </Content>
      <RightArrow />
    </Container>
  )
}

export default Module
