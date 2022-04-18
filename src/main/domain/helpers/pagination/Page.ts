import { PAGE_DEFAULT_NUMBER, Pageable } from './Pageable'
import S, { ObjectSchema } from 'fluent-json-schema'
import { PaginateResult } from 'mongoose'

export class Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  hasPrevPage: boolean
  hasNextPage: boolean
  page: number
  prevPage: number
  nextPage: number

  constructor(_: {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    hasPrevPage: boolean
    hasNextPage: boolean
    page: number
    prevPage: number
    nextPage: number
  }) {
    this.content = _.content
    this.totalElements = _.totalElements
    this.totalPages = _.totalPages
    this.size = _.size
    this.hasPrevPage = _.hasPrevPage
    this.hasNextPage = _.hasNextPage
    this.page = _.page
    this.prevPage = _.prevPage
    this.nextPage = _.nextPage
  }

  static of<T>(_: PaginateResult<T>): Page<T> {
    return new Page<T>({
      content: _.docs,
      totalElements: _.totalDocs,
      totalPages: _.totalPages,
      size: _.limit,
      hasPrevPage: _.hasPrevPage,
      hasNextPage: _.hasNextPage,
      page: _.page ?? PAGE_DEFAULT_NUMBER,
      prevPage: _.prevPage ?? PAGE_DEFAULT_NUMBER,
      nextPage: _.nextPage ?? PAGE_DEFAULT_NUMBER
    })
  }

  static fromList<T>(p: { list: T[]; pageable: Pageable }): Page<T> {
    const pageNumber = p.pageable.page
    const pageSize = p.pageable.size
    const totalSize = p.list.length
    const offset = (pageNumber - PAGE_DEFAULT_NUMBER) * pageSize
    const totalPages = Math.ceil(p.list.length / p.pageable.size)

    if (Pageable.getSortOptions(p.pageable)) {
      const split = Pageable.getSortOptions(p.pageable)
      if (split?.sort && split.field) {
        p.list =
          split.sort === 'ASC'
            ? // eslint-disable-next-line no-magic-numbers
              [...p.list].sort((a, b) => (a[split.field] > b[split.field] ? 1 : -1))
            : // eslint-disable-next-line no-magic-numbers
              [...p.list].sort((a, b) => (a[split.field] > b[split.field] ? -1 : 1))
      }
    }

    let newList: T[] = []
    if (offset <= totalSize) {
      const limit = totalSize < offset + pageSize ? totalSize - offset : pageSize
      newList = p.list.slice(offset, offset + limit)
    }

    return new Page<T>({
      content: newList,
      hasNextPage: totalPages > p.pageable.page,
      hasPrevPage: p.pageable.page > PAGE_DEFAULT_NUMBER,
      nextPage: totalPages > p.pageable.page ? p.pageable.page + 1 : p.pageable.page,
      page: p.pageable.page,
      prevPage: p.pageable.page > PAGE_DEFAULT_NUMBER ? p.pageable.page - 1 : p.pageable.page,
      size: newList.length,
      totalElements: p.list.length,
      totalPages: totalPages
    })
  }
}

export function createPageVMSchema(vm: ObjectSchema): Record<string, unknown> {
  const schema = S.object()
    .prop('totalElements', S.number().minimum(0).required())
    .prop('totalPages', S.number().minimum(0).required())
    .prop('size', S.number().minimum(0).required())
    .prop('hasPrevPage', S.boolean())
    .prop('hasNextPage', S.boolean())
    .prop('page', S.number().minimum(0).required())
    .prop('prevPage', S.number().minimum(0).required())
    .prop('nextPage', S.number().minimum(0).required())
    .prop('content', S.array().items(vm))

  return { ...schema.valueOf() }
}
