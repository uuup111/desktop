import React, { useState } from 'react'
import styled from 'styled-components'
import Arrow from '../arrow.svg'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

const Container = styled.div`
  text-align: center;
  padding-top: 96px;
  padding-bottom: 30px;
  padding-left: 32px;
  padding-right: 32px;
  font-weight: 300;
  position: relative;
`
const Title = styled.div`
  font-size: 36px;
  line-height: 42px;
  margin-bottom: 77px;
`
const UpArrow = styled(Arrow)`
  position: absolute;
  right: 32px;
  bottom: 32px;
  -webkit-app-region: no-drag;
`
const scrollToTop = () => {
  document.documentElement.scrollTop = 0
}

const Footer = ({ title }) => {
  const [upArrowVisible, setUpArrowVisible] = useState(false)

  useScrollPosition(
    ({ currPos: { y } }) => {
      const isVisible = y < 48
      if (isVisible !== upArrowVisible) setUpArrowVisible(isVisible)
    },
    [upArrowVisible]
  )

  return (
    <Container>
      <Title>{title}</Title>
      Cooperatively made with 💜 in Berlin by Liberate Science GmbH
      {upArrowVisible && <UpArrow onClick={scrollToTop} />}
    </Container>
  )
}

export default Footer
