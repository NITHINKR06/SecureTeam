export interface IChannel {
  _id: string
  teamId: string
  name: string
  topic?: string
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}
