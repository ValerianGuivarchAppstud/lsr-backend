export class ReactAdminPage<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number

  constructor(_: {
    content: T[]
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    totalElements: number
    totalPages: number
  }) {
    this.content = _.content
    this.empty = false
    this.totalElements = _.totalElements
    this.totalPages = _.totalPages
    this.size = _.size
    this.first = _.first
    this.last = _.last
    this.number = _.number
    this.numberOfElements = _.numberOfElements
  }

  static ofList<T>(_: T[]): ReactAdminPage<T> {
    return new ReactAdminPage<T>({
      content: _,
      first: true,
      last: true,
      size: _.length,
      totalElements: _.length,
      totalPages: 1,
      number: 0,
      numberOfElements: _.length
    })
  }
}
