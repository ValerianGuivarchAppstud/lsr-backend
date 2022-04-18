import S from 'fluent-json-schema'

const PAGE_DEFAULT_SIZE = 10
// mongoose uses 1 as the first page number
export const PAGE_DEFAULT_NUMBER = 1
const PAGE_DEFAULT_SORT = 'ASC'

export interface IPageableParams {
  sort: string
  page: number
  size: number
}

export const IPageableParamsSchema = S.object()
  .prop('sort', S.string())
  .prop('page', S.number())
  .prop('size', S.number())

export interface IPageSortOption {
  field: string
  sort: string
}

export class Pageable {
  sort: string
  page: number
  size: number

  constructor(p: { sort?: string; page?: number; size?: number }) {
    this.sort = p.sort ?? PAGE_DEFAULT_SORT
    this.page = p.page !== undefined ? Number(p.page) : PAGE_DEFAULT_NUMBER
    this.size = p.size !== undefined ? Number(p.size) : PAGE_DEFAULT_SIZE
  }

  static getSortOptions(p: Pageable): IPageSortOption | undefined {
    // eslint-disable-next-line no-magic-numbers
    if (p.sort?.split(',').length === 2) {
      return {
        field: p.sort.split(',')[0],
        sort: p.sort.split(',')[1]
      }
    }
    return undefined
  }
}
