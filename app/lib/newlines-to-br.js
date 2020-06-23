import React, { Fragment } from 'react'

export default text =>
  text.split(/\r?\n/).map(line => (
    <Fragment key={line}>
      {line}
      <br />
    </Fragment>
  ))
