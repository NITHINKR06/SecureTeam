import { NextResponse } from "next/server"
import { connectDb } from "@/src/infrastructure/db/mongoose"
import { MessageModel } from "@/src/infrastructure/db/models/Message"
import { getAuthUser } from "@/src/infrastructure/auth/jwt"

export async function GET(req, context) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { channelId } = context.params
    if (!channelId) return NextResponse.json({ error: "Invalid params" }, { status: 400 })

    const url = new URL(req.url)
    const cursor = url.searchParams.get('cursor')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '30'), 100)

    await connectDb()

    const query = { channelId }
    if (cursor) {
      query._id = { $lt: cursor }
    }

    const messages = await MessageModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('userId', 'name email avatarUrl')
      .lean()

    const hasMore = messages.length > limit
    const items = hasMore ? messages.slice(0, limit) : messages
    const nextCursor = hasMore ? String(items[items.length - 1]._id) : null

    return NextResponse.json({ items, nextCursor })
  } catch (error) {
    console.error('GET /api/channels/[channelId]/messages error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req, context) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { channelId } = context.params
    if (!channelId) return NextResponse.json({ error: "Invalid params" }, { status: 400 })

    const body = await req.json().catch(() => null)
    if (!body || !body.body || !body.teamId) {
      return NextResponse.json({ error: "Invalid body" }, { status: 422 })
    }

    await connectDb()

    const doc = await MessageModel.create({
      teamId: body.teamId,
      channelId,
      userId: user.id,
      body: body.body,
      files: body.files || [],
      threadRootId: body.threadRootId,
    })

    const populated = await MessageModel.findById(doc._id)
      .populate('userId', 'name email avatarUrl')
      .lean()

    // TODO: emit socket event: message:new via gateway
    return NextResponse.json({ message: populated }, { status: 201 })
  } catch (error) {
    console.error('POST /api/channels/[channelId]/messages error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
