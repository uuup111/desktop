import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { purple, black, white, gray } from '../../lib/colors'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import HexIndicatorIsListed from './hex-indicator-is-listed.svg'
import HexIndicatorIsUnlisted from './hex-indicator-is-unlisted.svg'
import { useHistory, Link } from 'react-router-dom'
import Plus from './plus.svg'
import { encode } from 'dat-encoding'
import Anchor from '../anchor'

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
  padding: 2rem ${props => props.pad || 2}rem;
  position: relative;
  height: ${props => (props.isParent ? 136 : 296)}px;
  box-sizing: border-box;

  ${props =>
    !props.isParent &&
    css`
      :hover {
        ${AddContentWithParent} {
          display: block;
        }
      }
    `}
`
const Attributes = styled.div`
  display: inline-block;
`
const Attribute = styled.div``
const AttributeIcon = styled.div`
  margin-top: 1rem;
`
const Content = styled.div`
  position: absolute;
  left: calc(8rem + ${props => props.pad || 2}rem);
  top: 2rem;
  right: 12rem;
  bottom: 2rem;
  overflow: hidden;
`
const Title = styled.div`
  font-size: 1.5rem;
  line-height: 1.75rem;
`
const AuthorOfListedContent = styled(Anchor).attrs({
  as: Link
})`
  margin: 1rem 0;
  display: inline-block;
`
const AuthorOfUnlistedContent = styled.span`
  color: ${gray};
  margin: 1rem 0;
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
const ToggleParent = styled.p`
  position: absolute;
  bottom: 0;
  margin: 0;
  padding-bottom: 2px;
  -webkit-app-region: no-drag;

  :hover {
    padding-bottom: 0;
    border-bottom: 2px solid ${purple};
  }
`
const ToggleParentArrow = styled.span`
  width: 16px;
  display: inline-block;
`

const Module = ({ p2p, mod, pad, to, isParent }) => {
  const history = useHistory()
  const [isListed, setIsListed] = useState(false)
  const [authors, setAuthors] = useState([])
  const [showParent, setShowParent] = useState(false)
  const [parent, setParent] = useState()

  useEffect(() => {
    ;(async () => {
      const profiles = await p2p.listProfiles()

      setIsListed(
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

  if (mod.rawJSON.parents[0]) {
    useEffect(() => {
      ;(async () => {
        setParent(await p2p.get(mod.rawJSON.parents[0]))
      })()
    }, [mod])
  }

  return (
    <>
      <Container
        pad={pad}
        onClick={e => {
          if (e.target.tagName !== 'A') history.push(to)
        }}
        isParent={isParent}
      >
        <Attributes>
          <Attribute>{subtypes[mod.rawJSON.subtype] || 'Unknown'}</Attribute>
          <AttributeIcon>
            {isListed ? <HexIndicatorIsListed /> : <HexIndicatorIsUnlisted />}
          </AttributeIcon>
        </Attributes>
        <Content pad={pad}>
          <Title>{mod.rawJSON.title}</Title>
          {authors.map(author =>
            isListed ? (
              <AuthorOfListedContent key={author.rawJSON.url} to='/profile'>
                {author.rawJSON.title}
              </AuthorOfListedContent>
            ) : (
              <AuthorOfUnlistedContent key={author.rawJSON.url}>
                {author.rawJSON.title}
              </AuthorOfUnlistedContent>
            )
          )}
          {!isParent && <Description>{mod.rawJSON.description}</Description>}
          {!isParent && mod.rawJSON.parents[0] && (
            <ToggleParent
              onClick={e => {
                e.stopPropagation()
                setShowParent(!showParent)
              }}
            >
              <ToggleParentArrow>{showParent ? '▾' : '▸'}</ToggleParentArrow>
              Follows from
            </ToggleParent>
          )}
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
      {(showParent || isParent) && parent && (
        <Module
          p2p={p2p}
          mod={parent}
          to={`/content/${encode(parent.rawJSON.url)}`}
          pad={isParent ? pad : 4}
          isParent
        />
      )}
    </>
  )
}

export default Module
