import type { Assert, Length, Max, MaxLen, Min, MinLen } from 'ts-runtime-checks'

export type Num = Assert<number>

export type Str = Assert<string>

export type NumBetween<
    min extends number,
    max extends number
> = Assert<number & Min<min> & Max<max>>

export type StrBetween<
    min extends number,
    max extends number
> = Assert<string & MinLen<min> & MaxLen<max>>

export type NumArray<
    length extends number | undefined = undefined
> = length extends number
    ? Assert<number[] & Length<length>>
    : Assert<number[]>

export type StrArray<
    length extends number | undefined = undefined
> = length extends number
    ? Assert<string[] & Length<length>>
    : Assert<string[]>
