import React, { useState, useEffect } from 'react'
import { Title, TopRow } from '../layout/grid'
import { useParams } from 'react-router-dom'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import Content, { OpenFolder, ExportZip } from '../content/content'

const WorkspaceContent = ({ p2p, profile, setProfile }) => {
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
        {content && (
          <>
            <Title>{subtypes[content.rawJSON.subtype] || 'Content'}</Title>
            <OpenFolder mod={content} />
            <ExportZip mod={content} />
          </>
        )}
      </TopRow>
      {content && (
        <Content
          p2p={p2p}
          content={content}
          profile={profile}
          setProfile={setProfile}
          backTo='/'
        />
      )}
    </>
  )
}

export default WorkspaceContent
