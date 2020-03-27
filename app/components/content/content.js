import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple, white, green, yellow, red, gray } from '../../lib/colors'
import { encode } from 'dat-encoding'
import { Button } from '../layout/grid'
import { useHistory, Link } from 'react-router-dom'
import Arrow from '../arrow.svg'
import { remote } from 'electron'
import { promises as fs } from 'fs'
import AdmZip from 'adm-zip'

const Container = styled.div`
  margin: 32px 64px;
`
const BackArrow = styled(Arrow)`
  transform: rotate(270deg);
  display: block;
  margin-bottom: 32px;
`
const Parent = styled(Link)`
  text-decoration: none;
  color: ${white};
  border-bottom: 2px solid ${purple};
  display: inline-block;
  -webkit-app-region: no-drag;
  margin-bottom: 32px;

  :hover {
    background-color: ${purple};
    cursor: pointer;
  }
`
const ModuleTitle = styled.div`
  font-size: 32px;
  line-height: 37px;
  margin-bottom: 32px;
`
const PublishedAuthor = styled(Link)`
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
const UnpublishedAuthor = styled.span`
  color: ${gray};
  display: inline-block;
  font-size: 24px;
  margin-bottom: 2px;
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
  max-width: 640px;

  :hover {
    background-color: ${green};
  }
  :active {
    background-color: inherit;
  }
`

const Content = ({ p2p, content, profile, setProfile, backTo }) => {
  const [authors, setAuthors] = useState()
  const [parents, setParents] = useState()
  const [files, setFiles] = useState()
  const [isPublished, setIsPublished] = useState()
  const [isDeleting, setIsDeleting] = useState(false)
  const history = useHistory()

  const dir = `${remote.app.getPath('home')}/.p2pcommons/${encode(
    content.rawJSON.url
  )}`

  useEffect(() => {
    ;(async () => {
      const profiles = await p2p.listProfiles()
      const authors = content.rawJSON.authors.map(url => {
        const [key] = url.split('+')
        const author = profiles.find(p => encode(p.rawJSON.url) === encode(key))
        return author.rawJSON.title
      })
      setAuthors(authors)
    })()
  }, [content.rawJSON.url])

  useEffect(() => {
    ;(async () => {
      const parents = await Promise.all(
        content.rawJSON.parents.map(async url => p2p.clone(...url.split('+')))
      )
      setParents(parents)
    })()
  }, [content.rawJSON.url])

  useEffect(() => {
    ;(async () => {
      const isPublished = Boolean(
        profile.rawJSON.contents.find(url => {
          const [otherKey] = url.split('+')
          return encode(content.rawJSON.url) === encode(otherKey)
        })
      )
      setIsPublished(isPublished)
    })()
  }, [content.rawJSON.url, profile])

  useEffect(() => {
    ;(async () => {
      const files = await fs.readdir(dir)
      setFiles(files.filter(path => path !== 'dat.json'))
    })()
  }, [content.rawJSON.url])

  return (
    <>
      {authors && parents && (
        <Container>
          <BackArrow onClick={() => history.push(backTo)} />
          {parents.map(parent => (
            <Parent
              key={`${parent.rawJSON.url}+${parent.rawJSON.version}`}
              to={`/content/${encode(parent.rawJSON.url)}`}
            >
              {parent.rawJSON.title}
            </Parent>
          ))}
          <ModuleTitle>{content.rawJSON.title}</ModuleTitle>
          {authors.map(author =>
            isPublished ? (
              <PublishedAuthor key={author} to='/profile'>
                {author}
              </PublishedAuthor>
            ) : (
              <UnpublishedAuthor key={author}>{author}</UnpublishedAuthor>
            )
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
                  `dat://${encode(content.rawJSON.url)}+${
                    content.metadata.version
                  }`,
                  profile.rawJSON.url
                )
                setProfile(await p2p.get(profile.rawJSON.url))
                history.push(`/content/${encode(content.rawJSON.url)}`)
              }}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              color={green}
              onClick={async () => {
                await p2p.publish(
                  `dat://${encode(content.rawJSON.url)}+${
                    content.metadata.version
                  }`,
                  profile.rawJSON.url
                )
                setProfile(await p2p.get(profile.rawJSON.url))
              }}
            >
              Publish
            </Button>
          )}
          <Button
            color={red}
            isLoading={isDeleting}
            onClick={async () => {
              setIsDeleting(true)
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
