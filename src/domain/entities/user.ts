export interface IUser {
  _id: string
  email: string
  name: string
  avatarUrl?: string
  teams: string[] // team IDs
  createdAt: Date
  updatedAt: Date
}
