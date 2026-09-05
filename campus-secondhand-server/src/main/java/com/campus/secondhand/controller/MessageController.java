package com.campus.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.Message;
import com.campus.secondhand.mapper.MessageMapper;
import com.campus.secondhand.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    @Autowired
    private MessageService messageService;
    @Autowired
    private MessageMapper messageMapper;

    /**
     * 发送消息
     */
    @PostMapping("/send")
    public Result<Message> send(@RequestBody Map<String, Object> body) {
        Long fromUserId = Long.valueOf(body.get("fromUserId").toString());
        Long toUserId = Long.valueOf(body.get("toUserId").toString());
        String type = (String) body.getOrDefault("type", "text");
        String content = (String) body.get("content");
        Message msg = messageService.sendMessage(fromUserId, toUserId, type, content);
        return Result.ok(msg);
    }

    /**
     * 获取会话消息列表
     */
    @GetMapping("/conversation/{conversationId}")
    public Result<List<Message>> getMessages(@PathVariable String conversationId) {
        List<Message> messages = messageService.getMessages(conversationId);
        return Result.ok(messages);
    }

    /**
     * 获取用户会话列表
     */
    @GetMapping("/conversations/{userId}")
    public Result<List<Map<String, Object>>> getConversations(@PathVariable Long userId) {
        return Result.ok(messageService.getConversations(userId));
    }

    /**
     * 标记已读
     */
    @PutMapping("/read/{conversationId}")
    public Result<?> markRead(@PathVariable String conversationId, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        List<Message> unread = messageMapper.selectList(
                new LambdaQueryWrapper<Message>()
                        .eq(Message::getConversationId, conversationId)
                        .eq(Message::getToUserId, userId)
                        .eq(Message::getIsRead, 0));
        for (Message msg : unread) {
            msg.setIsRead(1);
            messageMapper.updateById(msg);
        }
        return Result.ok();
    }
}
