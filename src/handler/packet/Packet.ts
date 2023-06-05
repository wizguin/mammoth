import { parse } from 'elementtree'


export function parseXml(data: string) {
    try {
        const elementTree = parse(data)
        const root = elementTree.getroot()

        return root

    } catch {
        return null
    }
}

export function parseXt(data: string) {
    try {
        const parsed = data.split('%').filter(i => !!i)

        return {
            action: parsed[2],
            args: parsed.slice(3)
        }

    } catch {
        return null
    }
}

export function makeXt(args: (string | number | boolean)[]) {
    const handlerId = args.shift()
    const internalId = -1

    const xt = ['xt', handlerId, internalId]

    if (args.length) {
        xt.push(args.join('%'))
    }

    return `%${xt.join('%')}%`
}
