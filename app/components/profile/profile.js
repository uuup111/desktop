import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple } from '../../lib/colors'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow } from '../layout/grid'
import { useHistory } from 'react-router-dom'

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
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      const [profiles, contents] = await Promise.all([
        p2p.listProfiles(),
        Promise.all(
          profile.rawJSON.contents.map(url => {
            const [key, version] = url.split('+')
            const download = false
            return p2p.clone(key, version, download)
          })
        )
      ])
      const modules = contents.map(c => ({
        rawJSON: {
          title: c.module.title,
          description: c.module.description,
          url: c.module.url,
          type: c.module.p2pcommons.type,
          subtype: c.module.p2pcommons.subtype,
          main: c.module.p2pcommons.main,
          authors: c.module.p2pcommons.authors,
          parents: c.module.p2pcommons.parents
        },
        metadata: c.metadata
      }))
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

  return (
    <>
      <TopRow>
        <Title>{profile.rawJSON.title}</Title>
      </TopRow>
      <Header>
        <Avatar />
        <Description>{profile.rawJSON.description}</Description>
      </Header>
      <StickyRow top={114}>
        <Spacer />
        <Title>Content</Title>
      </StickyRow>
      {modules && authors && (
        <>
          {modules.map(mod => {
            const url = `/profile/${encode(mod.rawJSON.url)}`
            return (
              <Module
                key={mod.rawJSON.url}
                subtype={mod.rawJSON.subtype}
                version={mod.metadata.version}
                title={mod.rawJSON.title}
                authors={mod.rawJSON.authors.map(
                  url => authors[url].rawJSON.title
                )}
                description={mod.rawJSON.description}
                isPublished
                onClick={() => history.push(url)}
              />
            )
          })}
          <Footer
            title={
              modules.length
                ? `That’s all of ${profile.rawJSON.title}’s content 😎`
                : 'No content yet... 🤔'
            }
          />
        </>
      )}
    </>
  )
}

export default Profile
