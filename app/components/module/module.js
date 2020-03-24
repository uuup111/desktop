import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple, black, white, gray } from '../../lib/colors'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import HexPublished from './published.svg'
import HexUnpublished from './unpublished.svg'
import { useHistory, Link } from 'react-router-dom'
import Plus from './plus.svg'
import { encode } from 'dat-encoding'

const AddContentWithParent = styled(Plus)`
  position: absolute;
  right: 0;
  top: 0;
  display: none;
  border-left: 2px solid ${purple};
  padding: 123px 41px;

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
`
const Container = styled.div`
  border-bottom: 2px solid ${purple};
  padding: 32px ${props => (props.pad === 'small' ? 32 : 64)}px;
  position: relative;
  height: 296px;
  box-sizing: border-box;

  :hover {
    ${AddContentWithParent} {
      display: block;
    }
  }
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

const Module = ({ p2p, mod, pad, to }) => {
  const history = useHistory()
  const [isPublished, setIsPublished] = useState(false)
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    ;(async () => {
      const profiles = await p2p.listProfiles()

      setIsPublished(
        Boolean(
          profiles.find(profile =>
            Boolean(
              profile.rawJSON.contents.find(contentUrl => {
                const [key, version] = contentUrl.split('+')
                return (
                  encode(mod.rawJSON.url) === encode(key) &&
                  mod.metadata.version === Number(version)
                )
              })
            )
          )
        )
      )

      const authors = []
      for (const url of mod.rawJSON.authors) {
        const [key] = url.split('+')
        authors.push(profiles.find(p => encode(p.rawJSON.url) === encode(key)))
      }
      setAuthors(authors)
    })()
  }, [mod])

  return (
    <Container
      pad={pad}
      onClick={e => {
        if (e.target.tagName !== 'A') history.push(to)
      }}
    >
      <Attributes>
        <Attribute>{subtypes[mod.rawJSON.subtype] || 'Unknown'}</Attribute>
        <Attribute>v{mod.metadata.version}</Attribute>
        <AttributeIcon>
          {isPublished ? <HexPublished /> : <HexUnpublished />}
        </AttributeIcon>
      </Attributes>
      <Content pad={pad}>
        <Title>{mod.rawJSON.title}</Title>
        {authors.map(author =>
          isPublished ? (
            <PublishedAuthor key={author.rawJSON.url} to='/profile'>
              {author.rawJSON.title}
            </PublishedAuthor>
          ) : (
            <UnpublishedAuthor key={author.rawJSON.url}>
              {author.rawJSON.title}
            </UnpublishedAuthor>
          )
        )}
        <Description>{mod.rawJSON.description}</Description>
      </Content>
      <AddContentWithParent
        onClick={e => {
          e.stopPropagation()
          history.push(
            `/create/${encode(mod.rawJSON.url)}+${mod.metadata.version}`
          )
        }}
      />
    </Container>
  )
}

export default Module
