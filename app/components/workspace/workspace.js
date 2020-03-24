import React, { useState, useEffect } from 'react'
import { TopRow, Title, Button } from '../layout/grid'
import Module from '../module/module'
import { encode } from 'dat-encoding'
import Footer from '../footer/footer'
import { green } from '../../lib/colors'
import { useHistory } from 'react-router-dom'

export default ({ p2p }) => {
  const [modules, setModules] = useState()
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      setModules(await p2p.listContent())
    })()
  }, [])

  return (
    <>
      <TopRow>
        <Title>Workspace</Title>
        <Button color={green} onClick={() => history.push('/create')}>
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
                pad='small'
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
    </>
  )
}
