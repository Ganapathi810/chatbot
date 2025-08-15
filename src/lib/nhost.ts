import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN
const region = import.meta.env.VITE_NHOST_REGION

if (!subdomain) {
  throw new Error('VITE_NHOST_SUBDOMAIN environment variable is required. Please check your .env file.')
}

if (!region) {
  throw new Error('VITE_NHOST_REGION environment variable is required. Please check your .env file.')
}

export const nhost = new NhostClient({
  subdomain,
  region,
})