import { config as loadEnv } from 'dotenv'

// Loaded before `@payload-config` is imported so process.env is populated
// the same way Next.js populates it (.env, then .env.local overrides).
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })
