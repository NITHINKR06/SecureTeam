secureteam/
├─ app/
│  ├─ api/
│  │  └─ channels/
│  │     └─ [channelId]/
│  │        └─ messages/
│  │           └─ route.ts
│  ├─ layout.tsx  (edited: Inter + brand tokens)
│  ├─ styles/
│  │  └─ brand.css
│  └─ globals.css (shadcn defaults)
├─ components/
│  └─ message-item.tsx        (example UI component)
├─ src/
│  ├─ domain/
│  │  └─ entities/
│  │     ├─ user.ts
│  │     ├─ team.ts
│  │     ├─ channel.ts
│  │     ├─ message.ts
│  │     └─ file.ts
│  ├─ infrastructure/
│  │  ├─ auth/
│  │  │  └─ jwt.ts
│  │  └─ db/
│  │     ├─ mongoose.ts
│  │     └─ models/
│  │        ├─ User.ts
│  │        ├─ Team.ts
│  │        ├─ Channel.ts
│  │        ├─ Message.ts
│  │        └─ File.ts
│  └─ interfaces/
│     └─ ws/
│        └─ socket-gateway.ts
└─ (components/ui from shadcn available by default)
