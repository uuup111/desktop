import React, { useState, useEffect } from 'react'
import { TopRow, Title } from '../layout/grid'
import Module from '../module/module'
import { encode } from 'dat-encoding'
import Footer from '../footer/footer'
import AddContent from '../icons/add-content.svg'
import styled from 'styled-components'

const StyledAddContent = styled(AddContent)`
  vertical-align: middle;
  transform: scale(0.75);
  position: relative;
  top: -2px;
`

export default ({ p2p }) => {
  const [modules, setModules] = useState()

  useEffect(() => {
    ;(async () => {
      setModules(await p2p.listContent())
    })()
  }, [])

  return (
    <>
      <TopRow>
        <Title>Workspace</Title>
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
              <>
                {modules.length ? (
                  'You’ve reached the end! ✌️'
                ) : (
                  <>
                    Nothing here yet! Click <StyledAddContent /> to get started
                  </>
                )}
              </>
            }
          />
        </>
      )}
    </>
  )
}
