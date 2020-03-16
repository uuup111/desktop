import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple, white, green, yellow, red } from '../../lib/colors'
import { encode } from 'dat-encoding'
import { Title, StickyRow, TopRow, Button } from '../layout/grid'
import { useParams, useHistory } from 'react-router-dom'
import Arrow from '../arrow.svg'
import { shell, remote } from 'electron'
import { promises as fs } from 'fs'
import AdmZip from 'adm-zip'

const { alert } = window

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

const Content = ({ p2p, profile }) => {
  const { key } = useParams()
  const [content, setContent] = useState()
  const [authors, setAuthors] = useState()
  const [files, setFiles] = useState()
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
        <Title>{profile.rawJSON.title}</Title>
      </TopRow>
      <StickyRow top={116} noBorderTop>
        <Spacer />
        <Title>Content</Title>
      </StickyRow>
      {content && authors && (
        <Container>
          <BackArrow onClick={() => history.push('/profile')} />
          <ModuleTitle>{content.rawJSON.title}</ModuleTitle>
          {authors.map(author => (
            <Author key={author}>{author}</Author>
          ))}
          <Description>{content.rawJSON.description}</Description>
          <Button onClick={() => shell.openItem(dir)}>Open folder</Button>
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
                  onClick={() => shell.openItem(`${dir}/${path}`)}
                >
                  {path}
                </File>
              ))}
          </Files>
          <Button
            color={yellow}
            onClick={async () => {
              alert(
                'Not implemented because of https://github.com/p2pcommons/sdk-js/issues/134'
              )
              // await p2p.unpublish(`${content.rawJSON.url}+${content.metadata.version}`, profile.rawJSON.url)
              // history.push('/')
            }}
          >
            Unpublish
          </Button>
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
