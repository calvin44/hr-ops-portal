import Asana from 'asana'

export const getAsanaClient = () => {
  const client = new (Asana as any).ApiClient()
  client.authentications.token.accessToken = process.env.ASANA_ACCESS_TOKEN
  return client
}
