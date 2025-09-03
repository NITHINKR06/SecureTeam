import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDb } from "@/src/infrastructure/db/mongoose"
import { MessageModel } from "@/src/infrastructure/db/models/Message"
import { getAuthUser } from "@/src/infrastructure/auth/jwt"

const ParamsSchema = z.object({
  channelId: z.string().min(1),
})

const ListQuerySchema = z.object({
  cursor: z.string().optional(), // messageId cursor
  limit: z.coerce.number().min(1).max(100).default(30),
})

const CreateBodySchema = z.object({
  body: z.string().min(1).max(8000),
  teamId: z.string().min(1),
  files: z.array(z.string()).optional(),
  threadRootId: z.string().optional(),
})

export async function GET(req: NextRequest, ctx: { params: { channelId: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parseParams = ParamsSchema.safeParse(ctx.params)
  if (!parseParams.success) return NextResponse.json({ error: "Invalid params" }, { status: 400 })

  const url = new URL(req.url)
  const parsedQuery = ListQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()))
  if (!parsedQuery.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 })

  const { channelId } = parseParams.data
  const { cursor, limit } = parsedQuery.data

  await connectDb()

  const query: any = { channelId }
  if (cursor) {
    query._id = { $lt: cursor }
  }

  const messages = await MessageModel.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean()

  const hasMore = messages.length > limit
  const items = hasMore ? messages.slice(0, limit) : messages
  const nextCursor = hasMore ? String(items[items.length - 1]._id) : null

  return NextResponse.json({ items, nextCursor })
}

export async function POST(req: NextRequest, ctx: { params: { channelId: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parseParams = ParamsSchema.safeParse(ctx.params)
  if (!parseParams.success) return NextResponse.json({ error: "Invalid params" }, { status: 400 })

  const bodyJson = await req.json().catch(() => null)
  const parseBody = CreateBodySchema.safeParse(bodyJson)
  if (!parseBody.success) {
    return NextResponse.json({ error: "Invalid body", details: parseBody.error.flatten() }, { status: 422 })
  }

  const { channelId } = parseParams.data
  const { body, teamId, files = [], threadRootId } = parseBody.data

  await connectDb()

  const doc = await MessageModel.create({
    teamId,
    channelId,
    userId: user.id,
    body,
    files,
    threadRootId,
  })

  // TODO: emit socket event: message:new via gateway
  return NextResponse.json({ message: doc }, { status: 201 })
}
