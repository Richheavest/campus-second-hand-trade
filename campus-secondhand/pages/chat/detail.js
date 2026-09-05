// 聊天详情
const api = require('../../utils/api')
const { generateId } = require('../../utils/util')

const FALLBACK_AVATAR = '/images/avatar/avatar1.png'

Page({
  data: {
    conversationId: '',
    messages: [],
    currentUser: {},
    otherUser: {},
    currentUserId: 0,
    inputText: '',
    scrollToView: ''
  },

  onLoad(options) {
    const { conversationId } = options
    if (!conversationId) return

    const currentUser = wx.getStorageSync('currentUser') || {}
    if (!currentUser.avatarUrl) currentUser.avatarUrl = FALLBACK_AVATAR

    const [uid1, uid2] = conversationId.split('_')
    const otherUserId = String(currentUser.id) === uid1 ? uid2 : uid1

    this.setData({
      conversationId,
      currentUser,
      currentUserId: currentUser.id || 1
    })

    wx.setNavigationBarTitle({ title: '聊天' })
    this.loadMessages()
    this.loadOtherUser(otherUserId)
    // 标记已读
    api.markRead(conversationId, this.data.currentUserId).catch(() => {})
  },

  // 加载对方用户信息（头像 + 昵称）
  loadOtherUser(otherUserId) {
    api.getUserInfo(otherUserId).then(u => {
      if (!u) return
      if (!u.avatarUrl) u.avatarUrl = FALLBACK_AVATAR
      this.setData({ otherUser: u })
      wx.setNavigationBarTitle({ title: u.nickName || u.nickname || '聊天' })
    }).catch(() => {})
  },

  async loadMessages() {
    try {
      const msgs = await api.getMessages(this.data.conversationId)
      const formatted = (msgs || []).map(m => ({ ...m, timeText: this.formatMsgTime(m.createTime) }))
      this.setData({ messages: formatted }, () => this.scrollToBottom())
    } catch (err) {
      console.error('加载消息失败:', err)
      this.loadFromMock()
    }
  },

  loadFromMock() {
    const storage = require('../../utils/storage')
    const { mockMessages } = require('../../utils/mock')
    let allMessages = storage.get('chatMessages', mockMessages)
    const msgs = (allMessages[this.data.conversationId] || []).map(m => ({ ...m, timeText: this.formatMsgTime(m.createTime) }))
    this.setData({ messages: msgs }, () => this.scrollToBottom())
  },

  onInputChange(e) { this.setData({ inputText: e.detail.value }) },

  async onSendText() {
    const text = this.data.inputText.trim()
    if (!text) return

    const { conversationId, currentUserId } = this.data
    const [, uid2] = conversationId.split('_')
    const toUserId = String(currentUserId) === uid2 ? parseInt(conversationId.split('_')[0]) : parseInt(uid2)

    const newMsg = {
      id: 'msg_' + generateId(),
      conversationId,
      fromUserId: currentUserId,
      toUserId,
      type: 'text',
      content: text,
      createTime: new Date().toISOString(),
      timeText: this.formatMsgTime(new Date()),
      isRead: 0
    }

    // 乐观更新UI
    const messages = [...this.data.messages, newMsg]
    this.setData({ messages, inputText: '' }, () => this.scrollToBottom())

    // 发送到后端
    try {
      await api.sendMessage(currentUserId, toUserId, 'text', text)
    } catch (err) {
      console.warn('消息发送失败:', err)
    }
  },

  onChooseImage() {
    wx.chooseImage({
      count: 1, sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const { conversationId, currentUserId } = this.data
        const [, uid2] = conversationId.split('_')
        const toUserId = String(currentUserId) === uid2 ? parseInt(conversationId.split('_')[0]) : parseInt(uid2)

        const newMsg = {
          id: 'msg_' + generateId(),
          conversationId, fromUserId: currentUserId, toUserId,
          type: 'image', content: res.tempFilePaths[0],
          createTime: new Date().toISOString(),
          timeText: this.formatMsgTime(new Date()),
          isRead: 0
        }

        const messages = [...this.data.messages, newMsg]
        this.setData({ messages }, () => this.scrollToBottom())

        try { await api.sendMessage(currentUserId, toUserId, 'image', res.tempFilePaths[0]) } catch (e) {}
      }
    })
  },

  onPreviewImage(e) {
    wx.previewImage({ urls: [e.currentTarget.dataset.url], current: e.currentTarget.dataset.url })
  },

  pad(n) { return n < 10 ? '0' + n : '' + n },

  formatMsgTime(d) {
    const date = d instanceof Date ? d : new Date(String(d || '').replace(/-/g, '/').replace('T', ' '))
    if (isNaN(date.getTime())) return ''
    const now = new Date()
    const hm = this.pad(date.getHours()) + ':' + this.pad(date.getMinutes())
    if (date.toDateString() === now.toDateString()) return hm
    return (date.getMonth() + 1) + '-' + date.getDate() + ' ' + hm
  },

  scrollToBottom() {
    const { messages } = this.data
    if (messages.length > 0) {
      this.setData({ scrollToView: 'msg-' + messages[messages.length - 1].id })
    }
  }
})
