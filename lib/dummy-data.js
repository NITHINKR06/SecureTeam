// Dummy data for channels, messages, and users

export const getChannels = () => [
  { id: 1, name: 'general', description: 'Company-wide announcements', memberCount: 125, isPrivate: false, unreadCount: 3 },
  { id: 2, name: 'engineering', description: 'Engineering team discussions', memberCount: 48, isPrivate: false, unreadCount: 0 },
  { id: 3, name: 'product', description: 'Product updates and roadmap', memberCount: 32, isPrivate: false, unreadCount: 1 },
  { id: 4, name: 'design', description: 'Design team collaboration', memberCount: 24, isPrivate: false, unreadCount: 0 },
  { id: 5, name: 'marketing', description: 'Marketing campaigns and strategy', memberCount: 18, isPrivate: false, unreadCount: 5 },
  { id: 6, name: 'secret-project', description: 'Confidential project discussions', memberCount: 8, isPrivate: true, unreadCount: 0 },
]

export const getDirectMessages = () => [
  { id: 1, name: 'Sarah Chen', avatarUrl: null, isOnline: true, unreadCount: 2 },
  { id: 2, name: 'Mike Wilson', avatarUrl: null, isOnline: true, unreadCount: 0 },
  { id: 3, name: 'Emma Davis', avatarUrl: null, isOnline: false, unreadCount: 1 },
  { id: 4, name: 'Alex Johnson', avatarUrl: null, isOnline: true, unreadCount: 0 },
  { id: 5, name: 'Lisa Anderson', avatarUrl: null, isOnline: false, unreadCount: 0 },
]

export const getMessages = (channelId) => {
  const baseMessages = [
    {
      id: 'msg-1',
      user: { name: 'Sarah Chen', avatarUrl: null },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      bodyMarkdown: 'Hey team! Just pushed the latest updates to the staging environment. Please test when you get a chance.',
      reactions: [
        { emoji: '👍', count: 3, reactedByMe: true },
        { emoji: '🚀', count: 2, reactedByMe: false },
      ]
    },
    {
      id: 'msg-2',
      user: { name: 'Mike Wilson', avatarUrl: null },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      bodyMarkdown: 'Great work! I\'ll review the changes this afternoon. The new features look promising.',
      reactions: [
        { emoji: '✅', count: 1, reactedByMe: false },
      ]
    },
    {
      id: 'msg-3',
      user: { name: 'Emma Davis', avatarUrl: null },
      timestamp: new Date(Date.now() - 900000).toISOString(),
      bodyMarkdown: 'Found a small bug in the user authentication flow. Created a ticket: #BUG-1234',
      reactions: [
        { emoji: '👀', count: 2, reactedByMe: false },
        { emoji: '🐛', count: 1, reactedByMe: true },
      ]
    },
    {
      id: 'msg-4',
      user: { name: 'Alex Johnson', avatarUrl: null },
      timestamp: new Date(Date.now() - 600000).toISOString(),
      bodyMarkdown: 'I\'ll take a look at that bug right away. Should have a fix ready by EOD.',
      reactions: []
    },
    {
      id: 'msg-5',
      user: { name: 'Lisa Anderson', avatarUrl: null },
      timestamp: new Date(Date.now() - 300000).toISOString(),
      bodyMarkdown: 'Reminder: We have our weekly standup in 30 minutes. See you all there! 📅',
      reactions: [
        { emoji: '👍', count: 4, reactedByMe: false },
      ]
    },
  ]
  
  // Return different messages based on channel for variety
  if (channelId === 2) {
    return [
      {
        id: 'eng-1',
        user: { name: 'Tech Lead', avatarUrl: null },
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        bodyMarkdown: '## Code Review Guidelines\n\nPlease remember to:\n- Check for security vulnerabilities\n- Ensure proper error handling\n- Add unit tests for new features',
        reactions: [{ emoji: '📝', count: 5, reactedByMe: true }]
      },
      ...baseMessages.slice(0, 3)
    ]
  }
  
  return baseMessages
}

export const authenticateUser = (email, password) => {
  // Mock authentication
  const users = [
    { email: 'demo@secureteam.com', password: 'demo123', name: 'Demo User', role: 'member' },
    { email: 'admin@secureteam.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'john@secureteam.com', password: 'password123', name: 'John Doe', role: 'admin' },
    { email: 'sarah@secureteam.com', password: 'password123', name: 'Sarah Chen', role: 'member' },
  ]
  
  const user = users.find(u => u.email === email && u.password === password)
  if (user) {
    return { success: true, user: { ...user, password: undefined } }
  }
  
  return { success: false, error: 'Invalid credentials' }
}
