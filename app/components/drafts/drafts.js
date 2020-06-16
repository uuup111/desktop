import React, { useState, useEffect } from 'react'
import { TopRow, Title } from '../layout/grid'
import Module from '../module/module'
import { encode } from 'dat-encoding'
import Footer from '../footer/footer'
import AddContent from '../icons/add-content.svg'
import styled from 'styled-components'
import isModuleListed from '../../lib/is-module-listed'

const StyledAddContent = styled(AddContent)`
  vertical-align: middle;
  transform: scale(0.75);
  position: relative;
  top: -2px;
`

export default ({ p2p, profile }) => {
  const [drafts, setDrafts] = useState()
  const hasListedContent = profile.rawJSON.contents.length > 0

  useEffect(() => {
    ;(async () => {
      const modules = await p2p.listContent()
      const drafts = modules.filter(mod => !isModuleListed(mod, profile))
      setDrafts(drafts)
    })()
  }, [])

  return (
    <>
      <TopRow>
        <Title>Drafts</Title>
      </TopRow>
      {drafts && (
        <>
          {drafts.map(mod => {
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
                {drafts.length ? (
                  'You’ve reached the end! ✌️'
                ) : hasListedContent ? (
                  <>
                    No drafts! All your work is now on your profile 😎
                  </>
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
