package com.campus.secondhand.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.secondhand.entity.Message;
import com.campus.secondhand.entity.User;
import com.campus.secondhand.mapper.MessageMapper;
import com.campus.secondhand.mapper.UserMapper;
import com.campus.secondhand.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public Message sendMessage(Long fromUserId, Long toUserId, String type, String content) {
        // 生成统一会话ID（两个用户ID排序后拼接）
        String conversationId = generateConversationId(fromUserId, toUserId);

        Message msg = new Message();
        msg.setConversationId(conversationId);
        msg.setFromUserId(fromUserId);
        msg.setToUserId(toUserId);
        msg.setType(type);
        msg.setContent(content);
        msg.setIsRead(0);
        this.save(msg);

        // 更新对方未读数（这里只是保存消息，未读标记靠前端查询is_read=0统计）
        return msg;
    }

    @Override
    public List<Message> getMessages(String conversationId) {
        return this.list(new LambdaQueryWrapper<Message>()
                .eq(Message::getConversationId, conversationId)
                .orderByAsc(Message::getCreateTime));
    }

    @Override
    public List<Map<String, Object>> getConversations(Long userId) {
        // 查询该用户参与的所有会话中的最后一条消息
        // 简化版：先查所有消息，再内存聚合
        List<Message> allMessages = this.list(new LambdaQueryWrapper<Message>()
                .and(w -> w.eq(Message::getFromUserId, userId).or().eq(Message::getToUserId, userId))
                .orderByDesc(Message::getCreateTime));

        // 按会话ID分组，取每个会话的最新消息
        Map<String, Message> latestMap = new LinkedHashMap<>();
        for (Message msg : allMessages) {
            latestMap.putIfAbsent(msg.getConversationId(), msg);
        }

        // 构建返回
        List<Map<String, Object>> result = new ArrayList<>();
        for (Message msg : latestMap.values()) {
            Map<String, Object> conv = new HashMap<>();
            conv.put("conversationId", msg.getConversationId());
            conv.put("lastMessage", msg.getContent());
            conv.put("lastTime", msg.getCreateTime());

            // 对方用户信息
            Long otherUserId = msg.getFromUserId().equals(userId) ? msg.getToUserId() : msg.getFromUserId();
            User otherUser = userMapper.selectById(otherUserId);
            conv.put("otherUser", otherUser);

            // 未读数
            long unread = this.count(new LambdaQueryWrapper<Message>()
                    .eq(Message::getConversationId, msg.getConversationId())
                    .eq(Message::getToUserId, userId)
                    .eq(Message::getIsRead, 0));
            conv.put("unreadCount", unread);

            result.add(conv);
        }
        return result;
    }

    private String generateConversationId(Long uid1, Long uid2) {
        return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
    }
}
