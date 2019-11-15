'use strict'

const { Application } = require('spectron')
const path = require('electron')
const { test } = require('tap')

test('launch', async t => {
  const app = new Application({
    path,
    args: [__dirname],
    env: { CI: true }
  })
  await app.start()
  const count = await app.client.getWindowCount()
  t.equal(count, 1)
  await app.stop()
})
