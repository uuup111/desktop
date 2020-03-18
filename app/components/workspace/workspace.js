import React, { useState, useEffect } from 'react'
import { TopRow, Title, Button } from '../layout/grid'
import Module from '../module/module'
import { encode } from 'dat-encoding'
import Footer from '../footer/footer'
import { green } from '../../lib/colors'
import { useHistory } from 'react-router-dom'

export default ({ p2p }) => {
  const [modules, setModules] = useState()
  const [authors, setAuthors] = useState()
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      const [profiles, contents] = await Promise.all([
        p2p.listProfiles(),
        p2p.listContent()
      ])
      for (const content of contents) {
        content.isPublished = Boolean(
          profiles.find(profile =>
            Boolean(
              profile.rawJSON.contents.find(contentUrl => {
                const [key, version] = contentUrl.split('+')
                return (
                  encode(content.rawJSON.url) === encode(key) &&
                  content.metadata.version === Number(version)
                )
              })
            )
          )
        )
      }
      setModules(contents)

      const authors = {}
      for (const mod of contents) {
        for (const url of mod.rawJSON.authors) {
          const [key] = url.split('+')
          authors[url] = profiles.find(
            p => encode(p.rawJSON.url) === encode(key)
          )
        }
      }
      setAuthors(authors)
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
      {modules && authors && (
        <>
          {modules.map(mod => {
            return (
              <Module
                key={mod.rawJSON.url}
                subtype={mod.rawJSON.subtype}
                version={mod.metadata.version}
                title={mod.rawJSON.title}
                authors={mod.rawJSON.authors.map(
                  url => authors[url].rawJSON.title
                )}
                description={mod.rawJSON.description}
                isPublished={mod.isPublished}
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
