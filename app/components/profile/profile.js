import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import AvatarPlaceholder from './avatar-placeholder.svg'
import Module from '../module/module'
import Footer from '../footer/footer'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow, Spacer, Button } from '../layout/grid'
import { green, gray } from '../../lib/colors'
import { Textarea, Input } from '../forms/forms'

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
  const [isEditing, setIsEditing] = useState(true)

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

  useEffect(() => {
    fetchModules()
  }, [])

  return (
    <>
      <TopRow>
        <Title>
          {isEditing ? (
            <Input defaultValue={profile.rawJSON.title} />
          ) : (
            profile.rawJSON.title
          )}
        </Title>
        {isEditing ? (
          <>
            <Button color={green}>Save profile</Button>
            <Button color={gray} onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button color={green} onClick={() => setIsEditing(true)}>Edit profile</Button>
        )}
      </TopRow>
      <Header>
        <Avatar />
        <Description isEditing={isEditing}>
          {isEditing ? (
            <StyledTextarea defaultValue={profile.rawJSON.description} />
          ) : (
            profile.rawJSON.description
          )}
        </Description>
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
