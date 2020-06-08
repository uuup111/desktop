import React, { useState, useEffect } from 'react'
import { Title, StickyRow, TopRow } from '../layout/grid'
import { useParams } from 'react-router-dom'
import Content from '../content/content'

const ProfileContent = ({ p2p, profile, setProfile }) => {
  const { key } = useParams()
  const [content, setContent] = useState()

  useEffect(() => {
    ;(async () => {
      setContent(await p2p.get(key))
    })()
  }, [key])

  return (
    <>
      <TopRow>
        <Title>{profile.rawJSON.title}</Title>
      </TopRow>
      {content && (
        <Content
          p2p={p2p}
          content={content}
          profile={profile}
          setProfile={setProfile}
          renderRow={children => (
            <StickyRow top={116} noBorderTop>
              {children}
            </StickyRow>
          )}
        />
      )}
    </>
  )
}

export default ProfileContent
