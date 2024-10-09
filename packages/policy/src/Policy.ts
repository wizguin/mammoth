import { SimpleServer } from '@mammoth/shared'

const host = '0.0.0.0'
const port = parseInt(process.env.POLICY_PORT || '843')

new SimpleServer(host, port)
