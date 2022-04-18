// <romualdr>: Like any provider - inverse the dependency
// Domain should have is own object with only the needed fields
import { Page } from '../../domain/helpers/pagination/Page'
import { Pageable } from '../../domain/helpers/pagination/Pageable'
import { PaginateOptions, PaginateResult } from 'mongoose'

/* eslint-disable no-magic-numbers */
export class PaginationMapper {
  static fromPageable(p: Pageable): PaginateOptions {
    const sort = {}
    if (p.sort?.split(',').length === 2) {
      sort[p.sort.split(',')[0]] = p.sort.split(',')[1] === 'DESC' ? -1 : 1
    }

    const result: PaginateOptions = {
      sort: sort,
      page: p.page,
      limit: p.size,
      // this is meant to be able to sort with case insensitive
      collation: { locale: 'en' }
    }
    return result
  }

  static toPage<T>(result: PaginateResult<T>): Page<T> {
    return Page.of<T>(result)
  }
}
