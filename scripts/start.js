/* eslint-disable @typescript-eslint/no-var-requires */
const concurrently = require('concurrently')
const path = require('path')

const command = 'npm run start'

const worldsConf = [
    {
        id: 100,
        name: 'Blizzard',
        port: 6114
    }
]

const worlds = worldsConf.map(world => (
    {
        command: `${command} -- -i ${world.id} -n ${world.name} -p ${world.port}`,
        name: world.name.toLowerCase(),
        cwd: path.resolve('packages/world')
    }
))

const services = [
    { command, name: 'api', cwd: path.resolve('packages/api') },
    { command, name: 'join', cwd: path.resolve('packages/join') },
    { command, name: 'policy', cwd: path.resolve('packages/policy') }
]

const { result } = concurrently(
    [...worlds, ...services],
    {
        prefixColors: 'auto'
    }
)

result.then(
    () => {},
    error => console.error(error)
)
