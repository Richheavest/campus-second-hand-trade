package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.Message;

import java.util.List;
import java.util.Map;

public interface MessageService extends IService<Message> {

    /**
     * 发送消息
     */
    Message sendMessage(Long fromUserId, Long toUserId, String type, String content);

    /**
     * 获取会话消息列表
     */
    List<Message> getMessages(String conversationId);

    /**
     * 获取用户会话列表
     */
    List<Map<String, Object>> getConversations(Long userId);
}
