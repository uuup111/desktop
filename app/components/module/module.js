import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { purple, black, white, gray } from '../../lib/colors'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import HexPublished from './published.svg'
import HexUnpublished from './unpublished.svg'
import { useHistory, Link } from 'react-router-dom'
import Plus from './plus.svg'
import { encode } from 'dat-encoding'
import RightArrow from './right-arrow.svg'

const Container = styled.div`
  border-bottom: 2px solid ${purple};
  padding: 32px ${props => (props.pad === 'small' ? 32 : 64)}px;
  position: relative;
  height: 296px;
  box-sizing: border-box;
`
const actionStyle = css`
  position: absolute;
  display: none;
  border-color: ${props => (props.disabled ? gray : purple)};
  border-style: solid;
  border-width: 0;

  ${props =>
    props.disabled &&
    `
    background-color: ${gray};
  `}

  ${Container}:hover & {
    display: block;
  }

  ${props =>
    !props.disabled &&
    `
    :hover {
      background-color: ${purple};
      path {
        fill: ${white};
      }
    }

    :active {
      background-color: inherit;
      path {
        fill: ${white};
      }
    }
  `}
`
const AddContentWithParent = styled(Plus)`
  ${actionStyle}
  right: 0;
  bottom: 0;
  border-left-width: 2px
  border-top-width: 2px;
  padding: 72px 41px;
`
const GoToChild = styled(RightArrow)`
  ${actionStyle}
  top: 0;
  right: 0;
  border-left-width: 2px;
  padding: 33px 15px;
`
const GoToParent = styled(RightArrow)`
  ${actionStyle}
  top: 0;
  right: 66px;
  border-right-width: 2px;
  padding: 33px 15px;
  transform: rotate(180deg);
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
const PublishedAuthor = styled(Link)`
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
const UnpublishedAuthor = styled.span`
  color: ${gray};
  margin: 16px 0;
  display: inline-block;
  padding-bottom: 2px;
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

const Module = ({
  p2p,
  subtype,
  version,
  title,
  authors,
  description,
  isPublished,
  pad,
  url,
  parent,
  children = [],
  to,
  update
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
        {authors.map(author =>
          isPublished ? (
            <PublishedAuthor key={author} to='/profile'>
              {author}
            </PublishedAuthor>
          ) : (
            <UnpublishedAuthor key={author}>{author}</UnpublishedAuthor>
          )
        )}
        <Description>{description}</Description>
      </Content>
      <GoToParent
        disabled={!parent}
        onClick={async e => {
          e.stopPropagation()
          if (!parent) return
          const mod = await p2p.get(parent)
          update({
            p2p,
            subtype: mod.rawJSON.subtype,
            version: mod.metadata.version,
            title: mod.rawJSON.title,
            authors,
            description: mod.rawJSON.description,
            isPublished: true,
            pad,
            url: mod.rawJSON.url,
            parent: mod.rawJSON.parents[0],
            to,
            children: [url, ...children],
            update
          })
        }}
      />
      <GoToChild
        disabled={!children.length}
        onClick={async e => {
          e.stopPropagation()
          if (!children.length) return
          const mod = await p2p.get(children[0])
          update({
            p2p,
            subtype: mod.rawJSON.subtype,
            version: mod.metadata.version,
            title: mod.rawJSON.title,
            authors,
            description: mod.rawJSON.description,
            isPublished: true,
            pad,
            url: mod.rawJSON.url,
            parent: mod.rawJSON.parents[0],
            children: children.slice(1),
            to,
            update
          })
        }}
      />
      <AddContentWithParent
        onClick={e => {
          e.stopPropagation()
          history.push(`/create/${encode(url)}+${version}`)
        }}
      />
    </Container>
  )
}

const ModuleWithParentNavigation = props => {
  const [mod, setMod] = useState(props)
  return <Module {...mod} update={setMod} />
}

export default ModuleWithParentNavigation
