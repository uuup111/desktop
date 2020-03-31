import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple } from '../../lib/colors'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow } from '../layout/grid'

const Spacer = styled.div`
  display: inline-block;
  width: 2rem;
  height: 100%;
  border-right: 2px solid ${purple};
  vertical-align: top;
`
const Header = styled.div`
  position: relative;
`
const Avatar = styled(AvatarPlaceholder)`
  margin-left: 4rem;
  margin-top: 2rem;
  margin-bottom: 23px;
`
const Description = styled.div`
  position: absolute;
  left: 206px;
  top: 4rem;
  right: 146px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`

const Profile = ({ p2p, profile }) => {
  const [modules, setModules] = useState()

  useEffect(() => {
    ;(async () => {
      const modules = await Promise.all(
        profile.rawJSON.contents.map(url => {
          const [key, version] = url.split('+')
          const download = false
          return p2p.clone(key, version, download)
        })
      )
      setModules(modules)
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
      {modules && (
        <>
          {modules.map(mod => {
            return (
              <Module
                key={mod.rawJSON.url}
                p2p={p2p}
                mod={mod}
                to={`/profile/${encode(mod.rawJSON.url)}`}
              />
            )
          })}
          <Footer
            title={
              modules.length
                ? 'You’ve reached the end! ✌️'
                : 'No content yet... 🤔'
            }
          />
        </>
      )}
    </>
  )
}

export default Profile
