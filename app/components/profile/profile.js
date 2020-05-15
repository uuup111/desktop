import React, { useState, useEffect, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow, Button } from '../layout/grid'
import { green, red, yellow } from '../../lib/colors'
import { Textarea, Input } from '../forms/forms'

const Header = styled.div`
  position: relative;
`
const Avatar = styled(AvatarPlaceholder)`
  margin-left: 2rem;
  margin-top: 2rem;
  margin-bottom: 23px;
`
const editing = keyframes`
  0% {
    border-left-color: transparent;
  }
  33% {
    border-left-color: ${yellow};
  }
  66% {
    border-left-color: transparent;
  }
  100% {
    border-left-color: ${yellow};
  }
`
const saving = keyframes`
  from {
    border-left-color: ${yellow};
  }
  to {
    border-left-color: transparent;
  }
`
const saved = keyframes`
  0% {
    border-left-color: transparent;
  }
  50% {
    border-left-color: ${green};
  }
  100% {
    border-left-color: transparent;
  }
`
const Indicator = styled.div`
  border-left: 2px solid transparent;
  height: 45px;
  display: inline-block;
  position: relative;
  left: -0.5rem;
  top: 0.5rem;
  margin-left: -2px;

  ${props =>
    props.isEditing &&
    css`
      animation: ${editing} 2s linear;
      border-left-color: ${yellow};
    `}
  ${props =>
    props.isSaving &&
    css`
      animation: ${saving} 1s linear;
      border-left-color: transparent;
    `}
  ${props =>
    props.isSaved &&
    css`
      animation: ${saved} 1s linear;
    `}
`
const Description = styled.div`
  position: absolute;
  left: 11rem;
  top: calc(4rem - 4px);
  right: 146px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: pre;
  border-left: 2px solid transparent;
  padding-left: 0.5rem !important;
  margin-left: calc(-0.5rem - 2px) !important;
  ${props =>
    props.isEditing &&
    css`
      animation: ${editing} 2s linear;
      border-left: 2px solid ${yellow};
    `}
  ${props =>
    props.isSaving &&
    css`
      animation: ${saving} 1s linear;
      border-left-color: transparent;
    `}
  ${props =>
    props.isSaved &&
    css`
      animation: ${saved} 1s linear;
    `}
`
const StyledTextarea = styled(Textarea)`
  height: ${props => props.lines * 24}px;
  border: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  resize: none;
`

const Profile = ({ p2p, profile, setProfile }) => {
  const [modules, setModules] = useState()
  const [isEditing, setIsEditing] = useState()
  const [isSaving, setIsSaving] = useState()
  const [isSaved, setIsSaved] = useState()
  const [description, setDescription] = useState(profile.rawJSON.description)
  const titleRef = useRef()
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
    setIsSaving(true)
    try {
      await p2p.set({
        url: profile.rawJSON.url,
        title: titleRef.current.value,
        description: descriptionRef.current.value
      })
    } finally {
      setIsSaving(false)
    }
    setProfile(await p2p.get(profile.rawJSON.url))
    setIsEditing(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
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
            <Indicator
              isEditing={isEditing}
              isSaving={isSaving}
              isSaved={isSaved}
            />
            {isEditing ? (
              <Input
                ref={titleRef}
                defaultValue={profile.rawJSON.title}
              />
            ) : (
              profile.rawJSON.title
            )}
          </Title>
          {isEditing ? (
            <>
              <Button color={green}>Save</Button>
              <Button
                color={red}
                onClick={() => {
                  setIsEditing(false)
                  setDescription(profile.rawJSON.description)
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button color={green} onClick={() => setIsEditing(true)}>
              Edit profile
            </Button>
          )}
        </TopRow>
        <Header>
          <Avatar />
          <Description
            isEditing={isEditing}
            isSaving={isSaving}
            isSaved={isSaved}
          >
            {isEditing ? (
              <StyledTextarea
                ref={descriptionRef}
                value={description}
                lines={Math.min(3, description.split(/\n/).length)}
                onChange={e => setDescription(e.target.value)}
              />
            ) : (
              profile.rawJSON.description
            )}
          </Description>
        </Header>
      </form>
      <StickyRow top={114}>
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
