package com.campus.secondhand.controller;

import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.User;
import com.campus.secondhand.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 微信登录
     */
    @PostMapping("/login")
    public Result<User> login(@RequestBody Map<String, String> body) {
        String openid = body.getOrDefault("openid", body.getOrDefault("code", "test_openid_001"));
        String nickname = body.get("nickname");
        String avatarUrl = body.get("avatarUrl");
        User user = userService.login(openid, nickname, avatarUrl);
        return Result.ok(user);
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/{userId}")
    public Result<User> getUserInfo(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return Result.notFound();
        }
        return Result.ok(user);
    }
}
