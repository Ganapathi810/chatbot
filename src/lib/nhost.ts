import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN || 'demo'
const region = import.meta.env.VITE_NHOST_REGION || 'eu-central-1'

console.log('Nhost config:', { subdomain, region });

export const nhost = new NhostClient({
  subdomain,
  region,
})