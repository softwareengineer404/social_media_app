import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import AppDataContext from './appDataContext.js'
import {
  createId,
  createInitialAppState,
  getStorageKey,
  readAppState,
  requestConnectionInState,
  respondToConnectionRequest,
  toggleFollowInState,
  updateProfileInState,
} from '../data/localAppState'

export const AppDataProvider = ({ clerkUser, children }) => {
  const [storedResult] = useState(() => readAppState(clerkUser.id, clerkUser))
  const [state, setState] = useState(storedResult.state)
  const currentUser = state.profiles.find((profile) => profile._id === clerkUser.id)

  useEffect(() => {
    if (storedResult.error) {
      console.error('Unable to restore local app data:', storedResult.error)
      toast.error('Saved data could not be opened. A fresh local profile was created.')
    }
  }, [storedResult.error])

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey(clerkUser.id),
        JSON.stringify(state)
      )
    } catch (error) {
      console.error('Unable to save local app data:', error)
      toast.error('Browser storage is full. Remove large uploads or clear old local data.', {
        id: 'local-storage-full',
        duration: 6000,
      })
    }
  }, [clerkUser.id, state])

  const value = useMemo(() => ({
    currentUser,
    profiles: state.profiles,
    posts: state.posts,
    stories: state.stories,
    messages: state.messages,
    connectionRequests: state.connectionRequests,
    bookmarks: state.bookmarks || [],
    updateProfile: (changes) => setState((current) =>
      updateProfileInState(current, clerkUser.id, changes)
    ),
    createPost: ({ content, image_urls }) => setState((current) => ({
      ...current,
      posts: [{
        _id: createId(),
        user: current.profiles.find((profile) => profile._id === clerkUser.id),
        content: content.trim(),
        image_urls,
        likes_count: [],
        comments: [],
        createdAt: new Date().toISOString(),
      }, ...current.posts],
    })),
    deletePost: (postId) => setState((current) => ({
      ...current,
      posts: current.posts.filter((post) =>
        post._id !== postId || post.user?._id !== clerkUser.id
      ),
    })),
    toggleLike: (postId) => setState((current) => ({
      ...current,
      posts: current.posts.map((post) => {
        if (post._id !== postId) return post
        const likes = post.likes_count || []
        return {
          ...post,
          likes_count: likes.includes(clerkUser.id)
            ? likes.filter((id) => id !== clerkUser.id)
            : [...likes, clerkUser.id],
        }
      }),
    })),
    addComment: (postId, text) => setState((current) => ({
      ...current,
      posts: current.posts.map((post) => post._id === postId
        ? {
          ...post,
          comments: [...(post.comments || []), {
            _id: createId(),
            user: current.profiles.find((profile) => profile._id === clerkUser.id),
            text: text.trim(),
            createdAt: new Date().toISOString(),
          }],
        }
        : post
      ),
    })),
    toggleBookmark: (postId) => setState((current) => {
      const bookmarks = current.bookmarks || []
      return {
        ...current,
        bookmarks: bookmarks.includes(postId)
          ? bookmarks.filter((id) => id !== postId)
          : [...bookmarks, postId],
      }
    }),
    createStory: (story) => setState((current) => ({
      ...current,
      stories: [{
        ...story,
        _id: createId(),
        user: current.profiles.find((profile) => profile._id === clerkUser.id),
        createdAt: new Date().toISOString(),
      }, ...current.stories],
    })),
    deleteStory: (storyId) => setState((current) => ({
      ...current,
      stories: current.stories.filter((story) =>
        story._id !== storyId || story.user?._id !== clerkUser.id
      ),
    })),
    toggleFollow: (userId) => setState((current) =>
      toggleFollowInState(current, clerkUser.id, userId)
    ),
    requestConnection: (userId) => setState((current) =>
      requestConnectionInState(current, clerkUser.id, userId)
    ),
    respondToConnection: (requestId, accept) => setState((current) =>
      respondToConnectionRequest(current, clerkUser.id, requestId, accept)
    ),
    removeConnection: (userId) => setState((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => ({
        ...profile,
        connections: profile._id === clerkUser.id || profile._id === userId
          ? profile.connections.filter((id) =>
            id !== (profile._id === clerkUser.id ? userId : clerkUser.id)
          )
          : profile.connections,
      })),
    })),
    sendMessage: (userId, { text, media_url = '' }) => setState((current) => ({
      ...current,
      messages: [...current.messages, {
        _id: createId(),
        from_user_id: clerkUser.id,
        to_user_id: userId,
        text: text.trim(),
        media_url,
        message_type: media_url ? 'image' : 'text',
        createdAt: new Date().toISOString(),
        seen: true,
      }],
    })),
    markConversationRead: (userId) => setState((current) => {
      const hasUnread = current.messages.some((message) =>
        message.from_user_id === userId
        && message.to_user_id === clerkUser.id
        && !message.seen
      )
      if (!hasUnread) return current
      return {
        ...current,
        messages: current.messages.map((message) =>
          message.from_user_id === userId && message.to_user_id === clerkUser.id
            ? { ...message, seen: true }
            : message
        ),
      }
    }),
    resetLocalData: () => setState(createInitialAppState(clerkUser)),
  }), [clerkUser, currentUser, state])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
