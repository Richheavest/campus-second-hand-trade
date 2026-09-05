// 消息列表
const api = require('../../utils/api')
const { timeAgo } = require('../../utils/util')

// 统一昵称字段（后端返回 nickname，前端用 nickName）
function normalizeUser(u) {
  if (!u) return {}
  return { ...u, nickName: u.nickName || u.nickname || '对方' }
}

Page({
  data: { chatList: [] },

  onShow() { this.loadConversations() },

  async loadConversations() {
    try {
      const userId = api.getCurrentUserId()
      const list = await api.getConversations(userId)
      const formatted = (list || []).map(item => ({
        conversationId: item.conversationId,
        otherUser: normalizeUser(item.otherUser),
        lastMessage: item.lastMessage || '',
        lastTime: item.lastTime,
        unreadCount: item.unreadCount || 0,
        lastTimeText: item.lastTime ? timeAgo(item.lastTime) : ''
      })).sort((a, b) => new Date(b.lastTime || 0) - new Date(a.lastTime || 0))

      this.setData({ chatList: formatted })
    } catch (err) {
      console.error('加载会话失败:', err)
      this.loadFromMock()
    }
  },

  loadFromMock() {
    const storage = require('../../utils/storage')
    const { mockChatList } = require('../../utils/mock')
    let list = storage.get('chatList', mockChatList)
    list = list.map(item => ({ ...item, lastTimeText: timeAgo(item.lastTime) }))
    this.setData({ chatList: list })
  },

  onTapChat(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/chat/detail?conversationId=${id}` })
  }
})
