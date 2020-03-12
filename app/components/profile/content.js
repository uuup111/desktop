import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple } from '../../lib/colors'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow } from '../layout/grid'
import { useParams, useHistory } from 'react-router-dom'
import Arrow from '../arrow.svg'

const Spacer = styled.div`
  display: inline-block;
  width: 62px;
  height: 100%;
  border-right: 2px solid ${purple};
  vertical-align: top;
`
const Container = styled.div`
  margin: 32px 64px;
`
const BackArrow = styled(Arrow)`
  transform: rotate(270deg);
`

const Profile = ({ p2p, profile }) => {
  const { key } = useParams()
  const [content, setContent] = useState()
  const [authors, setAuthors] = useState()
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      const [profiles, content] = await Promise.all([
        p2p.listProfiles(),
        p2p.get(key)
      ])
      setContent(content)

      const authors = {}
      for (const url of content.rawJSON.authors) {
        const [key] = url.split('+')
        authors[url] = profiles.find(p => encode(p.rawJSON.url) === encode(key))
      }
      setAuthors(authors)
    })()
  }, [])

  return (
    <>
      <TopRow>
        <Title>{profile.rawJSON.title}</Title>
      </TopRow>
      <StickyRow top={116} noBorderTop>
        <Spacer />
        <Title>Content</Title>
      </StickyRow>
      {content && authors && (
        <Container>
          <BackArrow onClick={() => history.push('/profile')} />
        </Container>
      )}
    </>
  )
}

export default Profile
