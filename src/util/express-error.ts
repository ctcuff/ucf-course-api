class ExpressError extends Error {
  public readonly status: number

  constructor({ message, status }: ExpressErrorOpts) {
    super(message)
    this.status = status
  }
}

type ExpressErrorOpts = {
  message: string
  status: number
}

export default ExpressError
