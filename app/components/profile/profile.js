import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow, Spacer, Button } from '../layout/grid'
import { green, red } from '../../lib/colors'
import { Textarea, Input } from '../forms/forms'
import AutosizeInput from 'react-input-autosize'

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
  ${props => props.isEditing && css`
    top: 2rem;
  `}
`
const StyledTextarea = styled(Textarea)`
  height: 8rem;
`

const Profile = ({ p2p, profile, setProfile }) => {
  const [modules, setModules] = useState()
  const [isEditing, setIsEditing] = useState(false)
  const [profileTitle, setProfileTitle] = useState(profile.rawJSON.title)
  const descriptionRef = useRef()

  const fetchModules = async () => {
    const modules = await Promise.all(
      profile.rawJSON.contents.map(url => {
        const [key, version] = url.split('+')
        const download = false
        return p2p.clone(key, version, download)
      })
    )
    setModules(modules)
  }

  const onSubmit = async e => {
    e.preventDefault()
    await p2p.set({
      url: profile.rawJSON.url,
      title: profileTitle,
      description: descriptionRef.current.value
    })
    setProfile(await p2p.get(profile.rawJSON.url))
    setIsEditing(false)
    await fetchModules()
  }

  useEffect(() => {
    fetchModules()
  }, [])

  return (
    <>
      <form onSubmit={onSubmit}>
        <TopRow>
          <Title>
            {isEditing ? (
              <Input
                as={AutosizeInput}
                value={profileTitle}
                onChange={e => setProfileTitle(e.target.value)}
              />
            ) : (
              profile.rawJSON.title
            )}
          </Title>
          {isEditing ? (
            <>
              <Button color={red} onClick={() => {
                setProfileTitle(profile.rawJSON.title)
                setIsEditing(false)
              }}>Cancel</Button>
              <Button color={green}>Save</Button>
            </>
          ) : (
            <Button color={green} onClick={() => setIsEditing(true)}>Edit profile</Button>
          )}
        </TopRow>
        <Header>
          <Avatar />
          <Description isEditing={isEditing}>
            {isEditing ? (
              <StyledTextarea ref={descriptionRef} defaultValue={profile.rawJSON.description} />
            ) : (
              profile.rawJSON.description
            )}
          </Description>
        </Header>
      </form>
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
