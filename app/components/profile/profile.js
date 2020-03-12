import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple } from '../../lib/colors'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from './module'
import Footer from './footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopStickyRow } from '../layout/grid'

const Spacer = styled.div`
  display: inline-block;
  width: 62px;
  height: 100%;
  border-right: 2px solid ${purple};
  vertical-align: top;
`
const Header = styled.div`
  position: relative;
`
const Avatar = styled(AvatarPlaceholder)`
  margin-left: 64px;
  margin-top: 32px;
  margin-bottom: 23px;
`
const Description = styled.div`
  position: absolute;
  left: 206px;
  top: 64px;
  right: 146px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`

const Profile = ({ p2p, profile }) => {
  const [modules, setModules] = useState()
  const [authors, setAuthors] = useState()

  useEffect(() => {
    ;(async () => {
      const [profiles, contents] = await Promise.all([
        p2p.listProfiles(),
        p2p.listContent()
      ])

      const modules = contents.filter(mod =>
        mod.rawJSON.authors.find(author => {
          const [key] = author.split('+')
          return encode(key) === encode(profile.rawJSON.url)
        })
      )
      setModules(modules)

      const authors = {}
      for (const mod of modules) {
        for (const url of mod.rawJSON.authors) {
          const [key] = url.split('+')
          authors[url] = profiles.find(
            p => encode(p.rawJSON.url) === encode(key)
          )
        }
      }
      setAuthors(authors)
    })()
  }, [])

  if (!modules || !authors) return null

  return (
    <>
      <TopStickyRow top={16}>
        <Title>{profile.rawJSON.title}</Title>
      </TopStickyRow>
      <Header>
        <Avatar />
        <Description>{profile.rawJSON.description}</Description>
      </Header>
      <StickyRow top={80}>
        <Spacer />
        <Title>Content</Title>
      </StickyRow>
      {modules.map(mod => (
        <Module
          key={mod.rawJSON.url}
          subtype={mod.rawJSON.subtype}
          version={mod.metadata.version}
          title={mod.rawJSON.title}
          authors={mod.rawJSON.authors.map(url => authors[url].rawJSON.title)}
          description={mod.rawJSON.description}
        />
      ))}
      <Footer
        title={
          modules.length
            ? `That’s all of ${profile.rawJSON.title}’s content 😎`
            : 'No content yet... 🤔'
        }
      />
    </>
  )
}

export default Profile
