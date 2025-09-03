export interface ITeam {
  _id: string
  name: string
  slug: string
  members: string[] // user IDs
  createdAt: Date
  updatedAt: Date
}
