import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { purple, white, green, yellow, red, gray } from '../../lib/colors'
import { encode } from 'dat-encoding'
import { Button, Title as TitleCell } from '../layout/grid'
import { useHistory, Link } from 'react-router-dom'
import Arrow from '../arrow.svg'
import { remote } from 'electron'
import { promises as fs } from 'fs'
import AdmZip from 'adm-zip'
import { Label, Select } from '../forms/forms'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import { Description, Title } from '../forms/editable'
import Anchor from '../anchor'

const Container = styled.div`
  margin: 2rem;
  margin-right: 6rem;
`
const BackArrow = styled(Arrow)`
  transform: rotate(270deg);
  display: block;
  margin-bottom: 2rem;
`
const Parent = styled(Link)`
  text-decoration: none;
  color: ${white};
  border-bottom: 2px solid ${purple};
  display: inline-block;
  -webkit-app-region: no-drag;
  margin-bottom: 2rem;

  :hover {
    background-color: ${purple};
    cursor: pointer;
  }
`
const ModuleTitle = styled(Title)`
  line-height: 1.25;
  margin-bottom: 2rem;
`
const AuthorOfListedContent = styled(Anchor).attrs({
  as: Link
})`
  display: inline-block;
  font-size: 1.5rem;
`
const AuthorOfUnlistedContent = styled.span`
  color: ${gray};
  display: inline-block;
  font-size: 1.5rem;
  margin-bottom: 2px;
`
const StyledDescription = styled(Description)`
  margin-top: 2rem;
  margin-bottom: 4rem;
`
const Files = styled.div`
  margin-bottom: 4rem;
`
const File = styled.div`
  border: 2px solid ${green};
  line-height: 2;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 1rem;
  max-width: 40rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  :hover {
    background-color: ${green};
  }
  :active {
    background-color: inherit;
  }
`
const StyledSelect = styled(Select)`
  border: 0;
  padding-left: 0;
  font-size: 2.5rem;
  margin-top: -1px;
  :focus {
    outline: 0;
  }
`

const modDirectory = mod =>
  `${remote.app.getPath('home')}/.p2pcommons/${encode(mod.rawJSON.url)}`

const OpenFolder = ({ mod }) => (
  <Button onClick={() => remote.shell.openItem(modDirectory(mod))}>
    Open folder
  </Button>
)

const ExportZip = ({ mod }) => (
  <Button
    onClick={async () => {
      const zip = new AdmZip()
      const dir = modDirectory(mod)
      const files = await fs.readdir(dir)
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
)

const Content = ({ p2p, content, profile, setProfile, renderRow }) => {
  const [authors, setAuthors] = useState()
  const [parents, setParents] = useState()
  const [files, setFiles] = useState()
  const [isListed, setIsListed] = useState()
  const [isDeleting, setIsDeleting] = useState()
  const [isEditing, setIsEditing] = useState()
  const [isSaving, setIsSaving] = useState()
  const [isSaved, setIsSaved] = useState()
  const [description, setDescription] = useState(content.rawJSON.description)
  const [isPopulatingDescription, setIsPopulatingDescription] = useState()
  const [title, setTitle] = useState(content.rawJSON.title)
  const [isTitleInvalid, setIsTitleInvalid] = useState()
  const [subtype, setSubtype] = useState(content.rawJSON.subtype)
  const history = useHistory()

  const dir = modDirectory(content)

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
      const isListed = Boolean(
        profile.rawJSON.contents.find(url => {
          const [otherKey] = url.split('+')
          return encode(content.rawJSON.url) === encode(otherKey)
        })
      )
      setIsListed(isListed)
    })()
  }, [content.rawJSON.url, profile])

  useEffect(() => {
    ;(async () => {
      const files = await fs.readdir(dir)
      setFiles(files.filter(path => path !== 'dat.json'))
    })()
  }, [content.rawJSON.url])

  return authors && parents ? (
    <>
      {renderRow(
        <>
          <TitleCell>
            {isEditing ? (
              <StyledSelect
                large
                defaultValue={subtype}
                onChange={e => setSubtype(e.target.value)}
              >
                {Object.entries(subtypes).map(([id, text]) => (
                  <option value={id} key={id}>
                    {text}
                  </option>
                ))}
              </StyledSelect>
            ) : (
              subtypes[content.rawJSON.subtype] || 'Content'
            )}
          </TitleCell>
          {isEditing ? (
            <>
              <Button
                color={green}
                onClick={async () => {
                  setIsSaving(true)
                  await p2p.set({
                    url: content.rawJSON.url,
                    title,
                    description,
                    subtype
                  })
                  content.rawJSON.description = description
                  content.rawJSON.title = title
                  content.rawJSON.subtype = subtype
                  setIsSaving(false)
                  setIsEditing(false)
                  setIsSaved(true)
                  setTimeout(() => setIsSaved(false), 2000)
                }}
              >
                Save
              </Button>
              <Button
                color={red}
                onClick={() => {
                  setDescription(content.rawJSON.description)
                  setTitle(content.rawJSON.title)
                  setSubtype(content.rawJSON.subtype)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <OpenFolder mod={content} />
              <ExportZip mod={content} />
              <Button color={green} onClick={() => setIsEditing(true)}>
                Edit content
              </Button>
            </>
          )}
        </>
      )}
      <Container>
        <BackArrow onClick={() => history.go(-1)} />
        {parents.map(parent => (
          <Parent
            key={`${parent.rawJSON.url}+${parent.rawJSON.version}`}
            to={`/content/${encode(parent.rawJSON.url)}`}
          >
            {parent.rawJSON.title}
          </Parent>
        ))}
        <ModuleTitle
          isEditing={isEditing}
          isSaving={isSaving}
          isSaved={isSaved}
          isInvalid={isTitleInvalid}
          value={title}
          onChange={e => {
            setTitle(e.target.value)
            setIsTitleInvalid(
              e.target.value.length === 0 || e.target.value.length > 300
            )
          }}
        />
        {authors.map(author =>
          isListed ? (
            <AuthorOfListedContent key={author} to='/profile'>
              {author}
            </AuthorOfListedContent>
          ) : (
            <AuthorOfUnlistedContent key={author}>
              {author}
            </AuthorOfUnlistedContent>
          )
        )}
        <StyledDescription
          isEditing={isEditing}
          isSaving={isSaving}
          isSaved={isSaved}
          value={description}
          isFocused={isPopulatingDescription}
          onClick={() => {
            if (description.length === 0 && !isEditing) {
              setIsEditing(true)
              setIsPopulatingDescription(true)
            }
          }}
          onChange={e => setDescription(e.target.value)}
        />
        {files && files.length > 0 && (
          <>
            <Label>Files</Label>
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
          </>
        )}
        {isListed ? (
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
              history.replace(`/content/${encode(content.rawJSON.url)}`)
            }}
          >
            Remove from profile
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
            Add to profile
          </Button>
        )}
        <Button
          color={red}
          isLoading={isDeleting}
          onClick={async () => {
            setIsDeleting(true)
            await p2p.unpublish(content.rawJSON.url, profile.rawJSON.url)
            await p2p.delete(content.rawJSON.url)
            setProfile(await p2p.get(profile.rawJSON.url))
            history.push('/')
          }}
        >
          Delete content
        </Button>
      </Container>
    </>
  ) : null
}

export default Content
