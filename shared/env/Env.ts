import { config } from 'dotenv'
import path from 'path'

const envPath = path.resolve(__dirname, '../../.env')

config({ path: envPath })
