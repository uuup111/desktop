import React from 'react'
import styled from 'styled-components'
import { TopRow, Title } from '../layout/grid'
import Arrow from '../arrow.svg'
import { Label, Select } from '../forms'
import subtypes from '@hypergraph-xyz/wikidata-identifiers'

const Container = styled.div`
  margin: 32px 64px;
`
const BackArrow = styled(Arrow)`
  transform: rotate(270deg);
`
const Form = styled.form`
  margin-top: 32px;
`

const Create = ({ p2p }) => (
  <>
    <TopRow>
      <Title>Add Content</Title>
    </TopRow>
    <Container>
      <BackArrow />
      <Form>
        <Label for='subtype'>Content type</Label>
        <Select id='subtype'>
          {Object.entries(subtypes).map(([id, text]) => (
            <option value={id} key={id}>
              {text}
            </option>
          ))}
        </Select>
        <Label for='files'>Upload files</Label>
      </Form>
    </Container>
  </>
)

export default Create
