import React, { useState } from 'react'
import styled from 'styled-components'
import { TopRow, Title, Button } from '../layout/grid'
import Arrow from '../arrow.svg'
import { Label, Select, Input, Textarea } from '../forms'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'
import AddFile from './add-file.svg'
import { remote } from 'electron'
import { purple } from '../../lib/colors'
import { basename } from 'path'
import RemoveFileIcon from './remove-file.svg'
import { promises as fs } from 'fs'
import { encode } from 'dat-encoding'
import { useHistory } from 'react-router-dom'

const Container = styled.div`
  margin: 32px 64px;
  max-width: 640px;
`
const BackArrow = styled(Arrow)`
  transform: rotate(270deg);
`
const Form = styled.form`
  margin-top: 32px;
`
const Files = styled.div`
  margin-bottom: 32px;
`
const File = styled.div`
  width: 100%;
  border: 2px solid ${purple};
  line-height: 32px;
  padding-left: 16px;
  margin-top: 16px;
  position: relative;
  box-sizing: border-box;
`
const RemoveFile = styled(RemoveFileIcon)`
  position: absolute;
  right: 16px;
  top: 7px;
`

const Create = ({ p2p }) => {
  const [files, setFiles] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const history = useHistory()

  return (
    <>
      <TopRow>
        <Title>Add Content</Title>
      </TopRow>
      <Container>
        <BackArrow />
        <Form
          onSubmit={async e => {
            e.preventDefault()
            setIsCreating(true)

            const subtype = e.target.subtype.value
            const title = e.target.title.value
            const description = e.target.description.value
            const main = e.target.main.value

            const {
              rawJSON: { url }
            } = await p2p.init({
              type: 'content',
              subtype,
              title,
              description
            })
            const dir = `${remote.app.getPath('home')}/.p2pcommons/${encode(
              url
            )}`
            for (const file of files) {
              await fs.copyFile(file, `${dir}/${basename(file)}`)
            }
            if (main) await p2p.set({ url, main: basename(main) })
            history.push('/')
          }}
        >
          <Label htmlFor='subtype'>Content type</Label>
          <Select large name='subtype'>
            {Object.entries(subtypes).map(([id, text]) => (
              <option value={id} key={id}>
                {text}
              </option>
            ))}
          </Select>
          <Label htmlFor='files'>Upload files</Label>
          <Button
            onClick={async e => {
              e.preventDefault()
              const { filePaths } = await remote.dialog.showOpenDialog(
                remote.getCurrentWindow(),
                {
                  properties: ['multiSelections', 'openFile']
                }
              )
              setFiles([...files, ...filePaths])
            }}
          >
            <AddFile />
          </Button>
          <Files>
            {files.map(file => (
              <File key={file}>
                {basename(file)}
                <RemoveFile
                  onClick={() => {
                    const newFiles = [...files]
                    newFiles.splice(newFiles.indexOf(file), 1)
                    setFiles(newFiles)
                  }}
                />
              </File>
            ))}
          </Files>
          <Label htmlFor='main'>Main file</Label>
          <Select name='main'>
            <option value=''>No main</option>
            {files.map(file => (
              <option value={file} key={file}>
                {basename(file)}
              </option>
            ))}
          </Select>
          <Label htmlFor='title'>Title</Label>
          <Input type='text' name='title' required />
          <Label htmlFor='description'>Description</Label>
          <Textarea name='description' />
          <Button emphasis='top' disabled={isCreating}>
            Add content
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default Create
