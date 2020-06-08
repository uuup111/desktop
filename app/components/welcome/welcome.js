import React, { useState } from 'react'
import styled from 'styled-components'
import { purple, black, green } from '../../lib/colors'
import { rgba } from 'polished'
import { Button } from '../layout/grid'
import Arrow from '../arrow.svg'
import { Label } from '../forms/forms'
import TitleInput from '../forms/title-input'
import IllustrationWelcome from './illustrations/welcome.svg'
import IllustrationAsYouGo from './illustrations/as-you-go.svg'
import IllustrationAsYouGo2 from './illustrations/as-you-go-2.svg'
import IllustrationProfileCreation from './illustrations/profile-creation.svg'
import IllustrationVault from './illustrations/vault.svg'

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${rgba(purple, 0.8)};
  z-index: 2;
`
const dialogSize = 700
const Dialog = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -${dialogSize / 2}px;
  margin-left: -${dialogSize / 2}px;
  width: ${dialogSize}px;
  height: ${dialogSize}px;
  background-color: ${black};
  padding: 2rem;
  box-sizing: border-box;
`
const Illustration = styled.div`
  margin-top: 22px;
  margin-bottom: 32px;
  width: 100%;
  height: 188px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Heading = styled.div`
  font-size: 32px;
  line-height: 37px;
  margin-bottom: 24px;
`
const Back = styled(Arrow)`
  transform: rotate(270deg);
  filter: brightness(${props => (props.page === 0 ? 0 : 100)}%);
`
const Form = styled.form`
  position: absolute;
  bottom: 32px;
  left: 32px;
  right: 32px;
`
const Initials = styled.div`
  position: absolute;
  top: 4rem;
  color: black;
  font-size: 40px;
`

const toInitials = name => {
  if (!name || !name.length) return '?'
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .filter(Boolean)
  return [initials.shift(), initials.pop()].filter(Boolean).join('')
}

const dialogs = [
  ({ page, next }) => (
    <Dialog>
      <Back page={page} />
      <Illustration>
        <IllustrationWelcome />
      </Illustration>
      <Heading>Welcome to Hypergraph</Heading>
      <p>
        We aim to reinvent the publication process in a way that empowers you to
        do better science. Science that is transparent and accessible to
        everyone, free from time-consuming bureaucracy and centralized control.
      </p>
      <p>
        Let us explain some of the basic concepts of Hypergraph before you get
        started...
      </p>
      <Form onSubmit={next}>
        <Button emphasis='top' autoFocus>
          Next
        </Button>
      </Form>
    </Dialog>
  ),
  ({ page, next, previous }) => (
    <Dialog>
      <Back page={page} onClick={previous} />
      <Illustration>
        <IllustrationAsYouGo />
      </Illustration>
      <Heading>As-you-go, not after-the-fact</Heading>
      <p>
        You are probably used to doing research, writing a full paper and then
        going through the laborious process of finding a journal. With
        Hypergraph, we support publishing each step of your research as-you-go.
      </p>
      <p>
        As-you-go publishing increases the value of your work by making it
        available to others as soon as you feel ready. It also breaks down the
        research process into bite-size chunks 🍰
      </p>
      <Form onSubmit={next}>
        <Button emphasis='top' autoFocus>
          Next
        </Button>
      </Form>
    </Dialog>
  ),
  ({ page, next, previous }) => (
    <Dialog>
      <Back page={page} onClick={previous} />
      <Illustration>
        <IllustrationAsYouGo2 />
      </Illustration>
      <Heading>How Hypergraph works</Heading>
      <p>
        Each part of your research, whether it's a proposal, a literature study,
        a data set or a conclusion, is its own publication. You link them
        together as you go along, to create a connected body of work.
      </p>
      <p>
        This makes it much easier to do replications or multiple interpretations
        with the same source material. Even if someone else created it. You just
        link your content to the existing content and there you go 🌈
      </p>
      <Form onSubmit={next}>
        <Button emphasis='top' autoFocus color={green}>
          Create Profile
        </Button>
      </Form>
    </Dialog>
  ),
  ({ page, next, previous, name, setName }) => {
    const [isValid, setIsValid] = useState(Boolean(name))
    const [initials, setInitials] = useState(toInitials(name))
    return (
      <Dialog>
        <Back page={page} onClick={previous} />
        <Illustration>
          <IllustrationProfileCreation />
          <Initials>{initials}</Initials>
        </Illustration>
        <Heading>What should we call you?</Heading>
        <p>
          Time to create a profile! This is where your published work is
          displayed. Right now, your profile is just for you. In later versions,
          your profile and your content can be shared with others.
        </p>
        <Form
          onSubmit={e => {
            e.preventDefault()
            setName(e.target.title.value)
            next()
          }}
        >
          <Label htmlFor='name'>Full Name (required)</Label>
          <TitleInput
            placeholder='Name...'
            onIsValid={setIsValid}
            autoFocus
            defaultValue={name}
            onChange={e => setInitials(toInitials(e.target.value))}
          />
          <Button emphasis='top' autoFocus disabled={!isValid}>
            Next
          </Button>
        </Form>
      </Dialog>
    )
  },
  ({ page, p2p, name, setProfile, previous }) => {
    const [isLoading, setIsLoading] = useState(false)

    return (
      <Dialog>
        <Back page={page} onClick={() => !isLoading && previous()} />
        <Illustration>
          <IllustrationVault />
        </Illustration>
        <Heading>Introducing the Vault</Heading>
        <p>
          We'll be launching this soon! Consider this our hosting service, to
          make sure your content stays available to everyone. Pay once and your
          work stays safe forever 🎉
        </p>
        <Form
          onSubmit={async e => {
            e.preventDefault()
            setIsLoading(true)
            const profile = await p2p.init({ type: 'profile', title: name })
            setProfile(profile)
          }}
        >
          <Button emphasis='top' autoFocus isLoading={isLoading}>
            Go to workspace
          </Button>
        </Form>
      </Dialog>
    )
  }
]

const Welcome = ({ p2p, setProfile }) => {
  const [page, setPage] = useState(0)
  const [name, setName] = useState()

  const next = async e => {
    if (e) e.preventDefault()
    setPage(page + 1)
  }
  const previous = () => setPage(page - 1)

  if (!dialogs[page]) return null

  return (
    <Overlay>
      {React.createElement(dialogs[page], {
        next,
        previous,
        page,
        name,
        setName,
        p2p,
        setProfile
      })}
    </Overlay>
  )
}

export default Welcome
