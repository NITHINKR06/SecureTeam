const mongoose = require('mongoose')
const argon2 = require('argon2')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: function() {
      // Password not required for Google/Firebase users
      return this.provider === 'local'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatarUrl: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'firebase'],
    default: 'local'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'away', 'busy'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'guest'],
    default: 'member'
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  preferences: {
    theme: {
      type: String,
      default: 'dark',
      enum: ['light', 'dark', 'system']
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and user is local provider
  if (!this.isModified('password') || this.provider !== 'local') {
    return next()
  }
  
  try {
    this.password = await argon2.hash(this.password)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Skip password check for non-local providers
  if (this.provider !== 'local') {
    return false
  }
  
  try {
    return await argon2.verify(this.password, candidatePassword)
  } catch (error) {
    return false
  }
}

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0]
})

// Method to get public profile
userSchema.methods.toPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatarUrl: this.avatarUrl,
    role: this.role,
    status: this.status,
    provider: this.provider,
    isOnline: this.isOnline,
    lastLogin: this.lastLogin
  }
}

// Avoid duplicate index warning
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ googleId: 1 }, { sparse: true })
userSchema.index({ teams: 1 })

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

module.exports = UserModel
