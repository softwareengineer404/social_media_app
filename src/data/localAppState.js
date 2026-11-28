import {
  dummyConnectionsData,
  dummyPostsData,
  dummyStoriesData,
  dummyUserData,
  sampleProfileImage,
} from '../assets/assets'

const STORAGE_VERSION = 1

export const createId = () => globalThis.crypto?.randomUUID?.()
  ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const getStorageKey = (userId) => `pingup:local:v${STORAGE_VERSION}:${userId}`

export const createInitialAppState = (clerkUser) => {
  const email = clerkUser.primaryEmailAddress?.emailAddress ?? ''
  const otherUsers = dummyConnectionsData
    .filter((user) => user._id !== dummyUserData._id)
    .map((user) => ({
      ...user,
      followers: [],
      following: [],
      connections: [],
    }))
  const currentUser = {
    ...dummyUserData,
    _id: clerkUser.id,
    email,
    full_name: clerkUser.fullName || clerkUser.firstName || 'New member',
    username: clerkUser.username || email.split('@')[0] || 'new_member',
    profile_picture: clerkUser.imageUrl || sampleProfileImage,
    followers: [],
    following: otherUsers[0] ? [otherUsers[0]._id] : [],
    connections: otherUsers[0] ? [otherUsers[0]._id] : [],
    createdAt: clerkUser.createdAt || new Date().toISOString(),
  }
  if (otherUsers[0]) {
    otherUsers[0].followers = [currentUser._id]
    otherUsers[0].connections = [currentUser._id]
  }
  const profiles = [currentUser, ...otherUsers]

  return {
    profiles,
    posts: dummyPostsData.map((post, index) => ({
      ...post,
      _id: createId(),
      user: index % 3 === 0 ? currentUser : profiles[(index % 2) + 1],
      image_urls: [...(post.image_urls || [])],
      likes_count: [...(post.likes_count || [])],
      comments: [],
    })),
    stories: dummyStoriesData.map((story, index) => ({
      ...story,
      _id: createId(),
      user: profiles[index % profiles.length],
      createdAt: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
    })),
    messages: otherUsers[0] ? [
      {
        _id: createId(),
        from_user_id: otherUsers[0]._id,
        to_user_id: currentUser._id,
        text: 'Hey! Welcome to the community. What have you been working on lately?',
        media_url: '',
        message_type: 'text',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        seen: false,
      },
      {
        _id: createId(),
        from_user_id: currentUser._id,
        to_user_id: otherUsers[0]._id,
        text: 'Thanks! I am excited to be here.',
        media_url: '',
        message_type: 'text',
        createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        seen: true,
      },
    ] : [],
    connectionRequests: otherUsers[1] ? [{
      _id: createId(),
      fromUserId: otherUsers[1]._id,
      toUserId: currentUser._id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }] : [],
    bookmarks: [],
  }
}

export const readAppState = (userId, clerkUser) => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId))
    if (!stored) return { state: createInitialAppState(clerkUser), error: null }

    const state = JSON.parse(stored)
    if (
      !Array.isArray(state.profiles)
      || !Array.isArray(state.posts)
      || !Array.isArray(state.stories)
      || !Array.isArray(state.messages)
      || !Array.isArray(state.connectionRequests)
      || !state.profiles.some((profile) => profile._id === userId)
    ) {
      throw new Error('Saved local app data has an unsupported format.')
    }

    return {
      state: {
        ...state,
        bookmarks: state.bookmarks || [],
        stories: state.stories.filter((story) =>
          Date.now() - new Date(story.createdAt).getTime() < 24 * 60 * 60 * 1000
        ),
      },
      error: null,
    }
  } catch (error) {
    return { state: createInitialAppState(clerkUser), error }
  }
}

export const updateProfileInState = (state, userId, changes) => ({
  ...state,
  profiles: state.profiles.map((profile) =>
    profile._id === userId ? { ...profile, ...changes } : profile
  ),
  posts: state.posts.map((post) => ({
    ...post,
    user: post.user?._id === userId ? { ...post.user, ...changes } : post.user,
    comments: (post.comments || []).map((comment) =>
      comment.user?._id === userId
        ? { ...comment, user: { ...comment.user, ...changes } }
        : comment
    ),
  })),
  stories: state.stories.map((story) =>
    story.user?._id === userId
      ? { ...story, user: { ...story.user, ...changes } }
      : story
  ),
})

export const toggleFollowInState = (state, currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) return state
  const currentUser = state.profiles.find((profile) => profile._id === currentUserId)
  const targetUser = state.profiles.find((profile) => profile._id === targetUserId)
  if (!currentUser || !targetUser) return state

  const isFollowing = currentUser.following.includes(targetUserId)
  return {
    ...state,
    profiles: state.profiles.map((profile) => {
      if (profile._id === currentUserId) {
        return {
          ...profile,
          following: isFollowing
            ? profile.following.filter((id) => id !== targetUserId)
            : [...profile.following, targetUserId],
        }
      }
      if (profile._id === targetUserId) {
        return {
          ...profile,
          followers: isFollowing
            ? profile.followers.filter((id) => id !== currentUserId)
            : [...profile.followers, currentUserId],
        }
      }
      return profile
    }),
  }
}

export const requestConnectionInState = (state, currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) return state
  const currentUser = state.profiles.find((profile) => profile._id === currentUserId)
  if (currentUser?.connections.includes(targetUserId)) return state
  const exists = state.connectionRequests.some((request) =>
    request.status === 'pending'
    && request.fromUserId === currentUserId
    && request.toUserId === targetUserId
  )
  if (exists) {
    return {
      ...state,
      connectionRequests: state.connectionRequests.filter((request) =>
        !(request.status === 'pending'
          && request.fromUserId === currentUserId
          && request.toUserId === targetUserId)
      ),
    }
  }

  return {
    ...state,
    connectionRequests: [
      ...state.connectionRequests,
      {
        _id: createId(),
        fromUserId: currentUserId,
        toUserId: targetUserId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ],
  }
}

export const respondToConnectionRequest = (state, currentUserId, requestId, accept) => {
  const request = state.connectionRequests.find((item) =>
    item._id === requestId
    && item.toUserId === currentUserId
    && item.status === 'pending'
  )
  if (!request) return state

  return {
    ...state,
    connectionRequests: state.connectionRequests.map((item) =>
      item._id === requestId
        ? { ...item, status: accept ? 'accepted' : 'declined' }
        : item
    ),
    profiles: accept
      ? state.profiles.map((profile) => {
        if (profile._id === currentUserId) {
          return {
            ...profile,
            connections: [...new Set([...profile.connections, request.fromUserId])],
          }
        }
        if (profile._id === request.fromUserId) {
          return {
            ...profile,
            connections: [...new Set([...profile.connections, currentUserId])],
          }
        }
        return profile
      })
      : state.profiles,
  }
}
