export type User = {
  name: string
  age: number
  sex: number
}

export type FolderInfo = {
  type: string
  name: string
  path: string
}

export type Response = {
  totalResults: number
  results: FolderInfo[]
}

export type Config = {
  username: string
  password: string
  serverUrl: string
  limit: number
}

