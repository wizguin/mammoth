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
            smartId: parseType(parsed[3]),
            args: getArgs(parsed)
        }

    } catch {
        return null
    }
}

export function makeXt(args: (number | string | object)[]) {
    const handlerId = args.shift()
    const smartId = -1

    const xt = ['xt', handlerId, smartId]

    if (args.length) {
        xt.push(args.map(arg => arg.toString()).join('%'))
    }

    return `%${xt.join('%')}%`
}

function getArgs(parsed: string[]) {
    return parsed.slice(4).map(arg => parseType(arg))
}

function parseType(value: number | string) {
    if (typeof value === 'number') {
        return value
    }

    const stringToNum = parseInt(value)

    return isNaN(stringToNum) ? value : stringToNum
}
