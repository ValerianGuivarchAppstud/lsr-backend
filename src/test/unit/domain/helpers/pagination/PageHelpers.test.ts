/* eslint-disable no-magic-numbers */
import { Page } from '../../../../../main/domain/helpers/pagination/Page'
import { Pageable } from '../../../../../main/domain/helpers/pagination/Pageable'

test('Page.fromList()', async () => {
  const totalElem = 45
  const pageSize = 10
  const pageNum = 1
  const foo = Array.from(Array(totalElem).keys())

  const result = Page.fromList({ list: foo, pageable: new Pageable({ sort: 'ASC', page: pageNum, size: pageSize }) })
  expect(result.totalElements).toBe(totalElem)
  expect(result.totalPages).toBe(totalElem % pageSize)
  expect(result.content.length).toBe(pageSize)
  expect(result.hasNextPage).toBe(true)
  expect(result.hasPrevPage).toBe(false)

  const result2 = Page.fromList({
    list: foo,
    pageable: new Pageable({ sort: 'ASC', page: pageNum + 1, size: pageSize })
  })
  expect(result2.totalElements).toBe(totalElem)
  expect(result2.totalPages).toBe(totalElem % pageSize)
  expect(result2.content.length).toBe(pageSize)
  expect(result2.hasPrevPage).toBe(true)

  const result4 = Page.fromList({
    list: foo,
    pageable: new Pageable({ sort: 'ASC', page: pageNum + 4, size: pageSize })
  })
  expect(result4.totalElements).toBe(totalElem)
  expect(result4.totalPages).toBe(totalElem % pageSize)
  expect(result4.content.length).toBe(totalElem - pageSize * (pageNum - 1 + 4))
  expect(result4.hasNextPage).toBe(false)
  expect(result4.hasPrevPage).toBe(true)
})

test('Page.fromList(5, 10)', async () => {
  const totalElem = 5
  const pageSize = 10
  const pageNum = 1
  const foo = Array.from(Array(totalElem).keys())

  const result = Page.fromList({ list: foo, pageable: new Pageable({ sort: 'ASC', page: pageNum, size: pageSize }) })
  expect(result.totalElements).toBe(totalElem)
  expect(result.totalPages).toBe(1)
  expect(result.content.length).toBe(totalElem)

  const result2 = Page.fromList({
    list: foo,
    pageable: new Pageable({ sort: 'ASC', page: pageNum + 1, size: pageSize })
  })
  expect(result2.totalElements).toBe(totalElem)
  expect(result2.totalPages).toBe(1)
  expect(result2.content.length).toBe(0)
})

test('Page.ofList - start of array', () => {
  const pageable = new Pageable({ sort: undefined, page: 1, size: 10 })
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const pageResult = Page.fromList({ list: array, pageable: pageable })

  expect(pageResult.content).toEqual(array.slice(0, 10))
  expect(pageResult.totalElements).toBe(array.length)
  expect(pageResult.totalPages).toBe(2)
  expect(pageResult.hasNextPage).toBe(true)
  expect(pageResult.hasPrevPage).toBe(false)
  expect(pageResult.nextPage).toBe(pageable.page + 1)
  expect(pageResult.prevPage).toBe(pageable.page)
  expect(pageResult.page).toBe(pageable.page)
  expect(pageResult.size).toBe(pageable.size)
})

test('Page.ofList - end of array', () => {
  const pageable = new Pageable({ sort: undefined, page: 2, size: 10 })
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const pageResult = Page.fromList({ list: array, pageable: pageable })

  expect(pageResult.content).toEqual(array.slice(10, array.length))
  expect(pageResult.totalElements).toBe(array.length)
  expect(pageResult.totalPages).toBe(2)
  expect(pageResult.hasNextPage).toBe(false)
  expect(pageResult.hasPrevPage).toBe(true)
  expect(pageResult.nextPage).toBe(pageable.page)
  expect(pageResult.prevPage).toBe(pageable.page - 1)
  expect(pageResult.page).toBe(pageable.page)
  expect(pageResult.size).toBe(5)
})

test('Page.ofList - middle of array', () => {
  const pageable = new Pageable({ sort: undefined, page: 2, size: 5 })
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const pageResult = Page.fromList({ list: array, pageable: pageable })

  expect(pageResult.content).toEqual(array.slice(5, 10))
  expect(pageResult.totalElements).toBe(array.length)
  expect(pageResult.totalPages).toBe(3)
  expect(pageResult.hasNextPage).toBe(true)
  expect(pageResult.hasPrevPage).toBe(true)
  expect(pageResult.nextPage).toBe(pageable.page + 1)
  expect(pageResult.prevPage).toBe(pageable.page - 1)
  expect(pageResult.page).toBe(pageable.page)
  expect(pageResult.size).toBe(5)
})

test('Page.ofList - start of array', () => {
  const pageable = new Pageable({ sort: undefined, page: 1, size: 10 })
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const pageResult = Page.fromList({ list: array, pageable: pageable })

  expect(pageResult.content).toEqual(array.slice(0, 10))
  expect(pageResult.totalElements).toBe(array.length)
  expect(pageResult.totalPages).toBe(2)
  expect(pageResult.hasNextPage).toBe(true)
  expect(pageResult.hasPrevPage).toBe(false)
  expect(pageResult.nextPage).toBe(pageable.page + 1)
  expect(pageResult.prevPage).toBe(pageable.page)
  expect(pageResult.page).toBe(pageable.page)
  expect(pageResult.size).toBe(pageable.size)
})

test('Page.ofList - end of array', () => {
  const pageable = new Pageable({ sort: undefined, page: 2, size: 10 })
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const pageResult = Page.fromList({ list: array, pageable: pageable })

  expect(pageResult.content).toEqual(array.slice(10, array.length))
  expect(pageResult.totalElements).toBe(array.length)
  expect(pageResult.totalPages).toBe(2)
  expect(pageResult.hasNextPage).toBe(false)
  expect(pageResult.hasPrevPage).toBe(true)
  expect(pageResult.nextPage).toBe(pageable.page)
  expect(pageResult.prevPage).toBe(pageable.page - 1)
  expect(pageResult.page).toBe(pageable.page)
  expect(pageResult.size).toBe(5)
})

test('Page.ofList - middle of array', () => {
  const pageable = new Pageable({ sort: undefined, page: 2, size: 5 })
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const pageResult = Page.fromList({ list: array, pageable: pageable })

  expect(pageResult.content).toEqual(array.slice(5, 10))
  expect(pageResult.totalElements).toBe(array.length)
  expect(pageResult.totalPages).toBe(3)
  expect(pageResult.hasNextPage).toBe(true)
  expect(pageResult.hasPrevPage).toBe(true)
  expect(pageResult.nextPage).toBe(pageable.page + 1)
  expect(pageResult.prevPage).toBe(pageable.page - 1)
  expect(pageResult.page).toBe(pageable.page)
  expect(pageResult.size).toBe(5)
})

test('Page.ofList() - with sorting options', () => {
  const obj1 = {
    name: 'aaa'
  }
  const obj2 = {
    name: 'bbb'
  }

  const list = [obj1, obj2]

  const result = Page.fromList({ list: list, pageable: new Pageable({ sort: 'name,ASC', page: 1, size: 15 }) })
  expect(result.content[0].name).toBe('aaa')

  const result2 = Page.fromList({ list: list, pageable: new Pageable({ sort: 'name,DESC', page: 1, size: 15 }) })
  expect(result2.content[0].name).toBe('bbb')
})
