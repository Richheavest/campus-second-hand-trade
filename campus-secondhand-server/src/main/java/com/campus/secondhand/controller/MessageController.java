package com.campus.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.secondhand.common.Result;
import com.campus.secondhand.common.UserContext;
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
        // 发送者身份从 token 解析，不信任前端传的 fromUserId
        Long fromUserId = UserContext.getUserId();
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
    @GetMapping("/conversations")
    public Result<List<Map<String, Object>>> getConversations() {
        Long userId = UserContext.getUserId();
        return Result.ok(messageService.getConversations(userId));
    }

    /**
     * 标记已读
     */
    @PutMapping("/read/{conversationId}")
    public Result<?> markRead(@PathVariable String conversationId, @RequestBody(required = false) Map<String, Long> body) {
        Long userId = UserContext.getUserId();
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
