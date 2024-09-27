export function dateString(date: Date) {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()

    return `${year}-${month}-${day}`
}

export function maxDate(dates: Date[]) {
    return new Date(Math.max(...dates.map(Number)))
}

export function titleCase(str: string) {
    return str.replace(/\w\S*/g, (word: string) =>
        word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
}
