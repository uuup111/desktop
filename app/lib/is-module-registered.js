import { encode } from 'dat-encoding'

export default function isModuleRegistered (mod, profile) {
  return (
    Boolean(
      profile.rawJSON.contents.find(contentUrl => {
        const [key, version] = contentUrl.split('+')
        return (
          encode(mod.rawJSON.url) === encode(key) &&
          mod.metadata.version === Number(version)
        )
      })
    )
  )
}
