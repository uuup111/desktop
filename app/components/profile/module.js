import React from 'react'
import styled from 'styled-components'
import { purple, black, white } from '../../lib/colors'
import Arrow from '../arrow.svg'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'

const Container = styled.div`
  border-bottom: 2px solid ${purple};
  padding: 32px 64px;
  position: relative;
  height: 296px;
  box-sizing: border-box;
`
const Attributes = styled.div`
  display: inline-block;
`
const Attribute = styled.div``
const Content = styled.div`
  position: absolute;
  left: calc(128px + 64px);
  top: 32px;
  right: 192px;
  bottom: 32px;
`
const Title = styled.div`
  font-size: 24px;
  line-height: 28px;
`
const Author = styled.a.attrs({
  href: '#'
})`
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

const Module = ({ subtype, version, title, authors, description }) => (
  <Container>
    <Attributes>
      <Attribute>{subtypes[subtype] || 'Unknown'}</Attribute>
      <Attribute>v.{version}</Attribute>
    </Attributes>
    <Content>
      <Title>{title}</Title>
      {authors.map(author => (
        <Author key={author}>{author}</Author>
      ))}
      <Description>{description}</Description>
    </Content>
    <RightArrow />
  </Container>
)

export default Module
