import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN || 'demo'
const region = import.meta.env.VITE_NHOST_REGION || 'eu-central-1'

console.log('Nhost config:', { subdomain, region });

export const nhost = new NhostClient({
  subdomain,
  region,
  authUrl: `https://${subdomain}.auth.${region}.nhost.run/v1`,
  graphqlUrl: `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`,
  storageUrl: `https://${subdomain}.storage.${region}.nhost.run/v1`,
  functionsUrl: `https://${subdomain}.functions.${region}.nhost.run/v1`,
})