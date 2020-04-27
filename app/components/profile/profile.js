import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow, Spacer } from '../layout/grid'
import ContentEditable from 'react-contenteditable'

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
const Editable = styled(ContentEditable)`
  :focus {
    outline: 0;
  }
`

const Profile = ({ p2p, profile, setProfile }) => {
  const [modules, setModules] = useState()
  const [titleWasSaved, setTitleWasSaved] = useState(false)
  const title = useRef(profile.rawJSON.title)

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

  const onBlur = async e => {
    if (e.target.innerText !== title.current) {
      title.current = e.target.innerText
      await p2p.set({ url: profile.rawJSON.url, title: e.target.innerText })
      setTitleWasSaved(true)
      setProfile(await p2p.get(profile.rawJSON.url))
      setTimeout(() => setTitleWasSaved(false), 1000)
    }
  }

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.target.blur()
    }
    if (e.keyCode === 27) {
      e.target.innerText = title.current
      e.target.blur()
    }
  }

  return (
    <>
      <TopRow>
        <Title wasSaved={titleWasSaved}>
          <Editable
            html={title.current}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        </Title>
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
