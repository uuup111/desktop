import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple, white, green, yellow, red, gray } from '../../lib/colors'
import { encode } from 'dat-encoding'
import { Title, TopRow, Button, Cell } from '../layout/grid'
import { useParams, useHistory } from 'react-router-dom'
import Arrow from '../arrow.svg'
import { remote } from 'electron'
import { promises as fs } from 'fs'
import AdmZip from 'adm-zip'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'

const Container = styled.div`
  margin: 32px 64px;
`
const BackArrow = styled(Arrow)`
  transform: rotate(270deg);
`
const ModuleTitle = styled.div`
  font-size: 32px;
  line-height: 37px;
  margin: 32px 0;
`
const Author = styled.a.attrs({
  href: '#'
})`
  text-decoration: none;
  color: ${white};
  border-bottom: 2px solid ${purple};
  display: inline-block;
  -webkit-app-region: no-drag;
  font-size: 24px;

  :hover {
    background-color: ${purple};
    cursor: pointer;
  }
`
const Description = styled.div`
  margin-top: 32px;
  margin-bottom: 64px;
`
const Files = styled.div`
  margin-bottom: 64px;
`
const File = styled.div`
  width: 100%;
  border: 2px solid ${green};
  line-height: 32px;
  padding-left: 16px;
  margin-top: 16px;

  :hover {
    background-color: ${green};
  }
  :active {
    background-color: inherit;
  }
`
const Unpublished = styled.p`
  color: ${gray};
  font-size: 24px;
  line-height: 38px;
`

const Content = ({ p2p, profile }) => {
  const { key } = useParams()
  const [content, setContent] = useState()
  const [authors, setAuthors] = useState()
  const [files, setFiles] = useState()
  const [isPublished, setIsPublished] = useState()
  const history = useHistory()

  const dir = `${remote.app.getPath('home')}/.p2pcommons/${encode(key)}`

  useEffect(() => {
    ;(async () => {
      const [profiles, content] = await Promise.all([
        p2p.listProfiles(),
        p2p.get(key)
      ])
      setContent(content)

      const authors = content.rawJSON.authors.map(url => {
        const [key] = url.split('+')
        const author = profiles.find(p => encode(p.rawJSON.url) === encode(key))
        return author.rawJSON.title
      })
      setAuthors(authors)

      const isPublished = Boolean(
        profile.rawJSON.contents.find(url => {
          const [otherKey] = url.split('+')
          return encode(key) === encode(otherKey)
        })
      )
      setIsPublished(isPublished)
    })()
  }, [key])

  useEffect(() => {
    ;(async () => {
      const files = await fs.readdir(dir)
      setFiles(files.filter(path => path !== 'dat.json'))
    })()
  }, [key])

  return (
    <>
      <TopRow>
        {content && (
          <>
            <Title>{subtypes[content.rawJSON.subtype] || 'Content'}</Title>
            <Cell>v. {content.metadata.version}</Cell>
          </>
        )}
      </TopRow>
      {content && authors && (
        <Container>
          <BackArrow onClick={() => history.push('/')} />
          <ModuleTitle>{content.rawJSON.title}</ModuleTitle>
          {isPublished ? (
            authors.map(author => <Author key={author}>{author}</Author>)
          ) : (
            <Unpublished>not yet published...</Unpublished>
          )}
          <Description>{content.rawJSON.description}</Description>
          <Button onClick={() => remote.shell.openItem(dir)}>
            Open folder
          </Button>
          <Button
            onClick={async () => {
              const zip = new AdmZip()
              for (const path of files) {
                zip.addLocalFile(`${dir}/${path}`)
              }
              const { filePath } = await remote.dialog.showSaveDialog(
                remote.getCurrentWindow(),
                {
                  defaultPath: 'module.zip'
                }
              )
              if (filePath) zip.writeZip(filePath)
            }}
          >
            Export .zip
          </Button>
          <Files>
            {files &&
              files.map(path => (
                <File
                  key={path}
                  onClick={() => remote.shell.openItem(`${dir}/${path}`)}
                >
                  {path}
                </File>
              ))}
          </Files>
          {isPublished ? (
            <Button
              color={yellow}
              onClick={async () => {
                await p2p.unpublish(
                  `dat://${key}+${content.metadata.version}`,
                  profile.rawJSON.url
                )
                setIsPublished(false)
              }}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              color={green}
              onClick={async () => {
                await p2p.publish(
                  `dat://${key}+${content.metadata.version}`,
                  profile.rawJSON.url
                )
                setIsPublished(true)
              }}
            >
              Publish
            </Button>
          )}
          <Button
            color={red}
            onClick={async () => {
              await p2p.delete(content.rawJSON.url)
              history.push('/')
            }}
          >
            Delete content
          </Button>
        </Container>
      )}
    </>
  )
}

export default Content
