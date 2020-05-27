import React, { useState, useEffect, useRef, Fragment } from 'react'
import styled, { css, keyframes } from 'styled-components'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow, Button } from '../layout/grid'
import { green, red, yellow } from '../../lib/colors'
import { Input } from '../forms/forms'
import { Description } from '../forms/editable'

const Header = styled.div`
  position: relative;
`
const Avatar = styled(AvatarPlaceholder)`
  margin-left: 2rem;
  margin-top: 2rem;
  margin-bottom: 23px;
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
  transition: border-left-color 1s;

  ${props =>
    props.isEditing &&
    css`
      border-left-color: ${yellow};
    `}
  ${props =>
    props.isInvalid &&
    css`
      border-left-color: ${red};
    `}
  ${props =>
    props.isSaving &&
    css`
      border-left-color: transparent;
    `}
  ${props =>
    props.isSaved &&
    css`
      animation: ${saved} 2s linear;
    `}
`

const Profile = ({ p2p, profile, setProfile }) => {
  const [modules, setModules] = useState()
  const [isEditing, setIsEditing] = useState()
  const [isPopulatingDescription, setIsPopulatingDescription] = useState()
  const [isSaving, setIsSaving] = useState()
  const [isSaved, setIsSaved] = useState()
  const [isTitleInvalid, setIsTitleInvalid] = useState()
  const [description, setDescription] = useState(profile.rawJSON.description)
  const titleRef = useRef()

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
        description: description
      })
    } catch (_) {
      setIsTitleInvalid(true)
      setIsSaving(false)
      setIsEditing(false)
      return
    }
    setIsTitleInvalid(false)
    setIsSaving(false)
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
              isInvalid={isTitleInvalid}
            />
            {isEditing ? (
              <Input
                ref={titleRef}
                defaultValue={profile.rawJSON.title}
                onChange={e => {
                  setIsTitleInvalid(
                    e.target.value.length === 0 || e.target.value.length > 300
                  )
                }}
              />
            ) : (
              profile.rawJSON.title
            )}
          </Title>
          {isEditing ? (
            <>
              <Button color={green} disabled={isTitleInvalid}>
                Save
              </Button>
              <Button
                color={red}
                onClick={() => {
                  setDescription(profile.rawJSON.description)
                  setIsEditing(false)
                  setIsTitleInvalid(false)
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
            value={description}
            isFocused={isPopulatingDescription}
            onClick={() => {
              if (description.length === 0 && !isEditing) {
                setIsEditing(true)
                setIsPopulatingDescription(true)
              }
            }}
            onChange={e => setDescription(e.target.value)}
          />
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
