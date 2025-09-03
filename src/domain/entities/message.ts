export interface IMessage {
  _id: string
  teamId: string
  channelId: string
  userId: string
  body: string // markdown
  reactions?: { emoji: string; userIds: string[] }[]
  files?: string[] // file IDs
  threadRootId?: string // for threads
  createdAt: Date
  updatedAt: Date
}
