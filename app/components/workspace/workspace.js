import React, { useState, useEffect } from 'react'
import { TopRow, Title, Button } from '../layout/grid'
import Module from '../module/module'
import { encode } from 'dat-encoding'
import Footer from '../footer/footer'
import { green, purple } from '../../lib/colors'
import { useHistory } from 'react-router-dom'
import Tour from 'reactour'
import styled from 'styled-components'

const StyledTour = styled(Tour)`
  color: black;
  button:focus {
    outline: 0;
  }
`

export default ({ p2p }) => {
  const [modules, setModules] = useState()
  const history = useHistory()
  const [isTourOpen, setIsTourOpen] = useState(true)

  useEffect(() => {
    ;(async () => {
      setModules(await p2p.listContent())
    })()
  }, [])

  return (
    <>
      <TopRow>
        <Title>Workspace</Title>
        <Button
          color={green}
          onClick={() => history.push('/create')}
          className='first-step'
        >
          Add content +
        </Button>
      </TopRow>
      {modules && (
        <>
          {modules.map(mod => {
            return (
              <Module
                key={mod.rawJSON.url}
                p2p={p2p}
                mod={mod}
                to={`/content/${encode(mod.rawJSON.url)}`}
              />
            )
          })}
          <Footer
            title={
              modules.length
                ? 'You’ve reached the end! ✌️'
                : "Nothing here yet! Click the 'Add content' button above to get started ☝️ "
            }
          />
        </>
      )}
      <StyledTour
        steps={[
          {
            selector: '.first-step',
            content: 'Here you can create your first content module.'
          },
          {
            selector: '.second-step',
            content: 'And afterwards take a look at your profile!'
          }
        ]}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        accentColor={purple}
      />
    </>
  )
}
