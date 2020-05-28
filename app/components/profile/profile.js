import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title as TitleCell, StickyRow, TopRow, Button } from '../layout/grid'
import { green, red } from '../../lib/colors'
import { Description, Title } from '../forms/editable'

const Header = styled.div`
  position: relative;
`
const Avatar = styled(AvatarPlaceholder)`
  margin-left: 2rem;
  margin-top: 2rem;
  margin-bottom: 23px;
`
const StyledDescription = styled(Description)`
  position: absolute;
  left: 11rem;
  top: calc(4rem - 4px);
  right: 146px;
`
const StyledTitle = styled(Title)`
  font-size: 2.5rem;
`

const Profile = ({ p2p, profile, setProfile }) => {
  const [modules, setModules] = useState()
  const [isEditing, setIsEditing] = useState()
  const [isPopulatingDescription, setIsPopulatingDescription] = useState()
  const [isSaving, setIsSaving] = useState()
  const [isSaved, setIsSaved] = useState()
  const [isTitleInvalid, setIsTitleInvalid] = useState()
  const [description, setDescription] = useState(profile.rawJSON.description)
  const [title, setTitle] = useState(profile.rawJSON.title)

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
        title,
        description
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
          <TitleCell>
            <StyledTitle
              isEditing={isEditing}
              isSaving={isSaving}
              isSaved={isSaved}
              isInvalid={isTitleInvalid}
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                setIsTitleInvalid(
                  e.target.value.length === 0 || e.target.value.length > 300
                )
              }}
            />
          </TitleCell>
          {isEditing ? (
            <>
              <Button color={green} disabled={isTitleInvalid}>
                Save
              </Button>
              <Button
                color={red}
                onClick={() => {
                  setDescription(profile.rawJSON.description)
                  setTitle(profile.rawJSON.title)
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
          <StyledDescription
            isEditing={isEditing}
            isSaving={isSaving}
            isSaved={isSaved}
            value={description}
            isFocused={isPopulatingDescription}
            maxRows={3}
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
