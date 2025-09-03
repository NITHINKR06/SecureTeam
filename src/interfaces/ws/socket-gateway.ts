import type { Server as IOServer, Socket } from "socket.io"

type ServerLike = IOServer

export function setupSocketGateway(io: ServerLike) {
  // Team namespace: /team-{teamId}
  io.of(/^\/team-\w+$/).on("connection", (socket: Socket) => {
    const namespace = socket.nsp.name // e.g. /team-abc123
    const teamId = namespace.replace("/team-", "")

    // Join/leave channel rooms
    socket.on("channel:join", (channelId: string) => {
      socket.join(roomForChannel(channelId))
    })

    socket.on("channel:leave", (channelId: string) => {
      socket.leave(roomForChannel(channelId))
    })

    // Typing indicators
    socket.on("presence:typing", ({ channelId, typing }: { channelId: string; typing: boolean }) => {
      socket.to(roomForChannel(channelId)).emit("presence:typing", { userId: socket.id, typing })
    })

    // Send message
    socket.on("message:send", async (payload: { channelId: string; message: any }) => {
      io.of(namespace).to(roomForChannel(payload.channelId)).emit("message:new", payload.message)
    })

    // Reactions
    socket.on("reaction:add", ({ channelId, messageId, emoji }) => {
      io.of(namespace).to(roomForChannel(channelId)).emit("reaction:added", { messageId, emoji })
    })
    socket.on("reaction:remove", ({ channelId, messageId, emoji }) => {
      io.of(namespace).to(roomForChannel(channelId)).emit("reaction:removed", { messageId, emoji })
    })
  })
}

function roomForChannel(channelId: string) {
  return `channel:${channelId}`
}
