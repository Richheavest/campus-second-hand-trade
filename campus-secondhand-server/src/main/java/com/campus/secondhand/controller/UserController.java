package com.campus.secondhand.controller;

import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.User;
import com.campus.secondhand.service.UserService;
import com.campus.secondhand.service.WxService;
import com.campus.secondhand.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private WxService wxService;
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 微信登录：code 换 openid → 自动注册 → 签发 JWT。
     * 返回 { token, user }。
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        // 兼容旧逻辑：显式传 openid（仅测试用）时直接使用
        String openid = body.get("openid");
        if (openid == null || openid.isEmpty()) {
            openid = wxService.code2session(code);
        }
        String nickname = body.get("nickname");
        String avatarUrl = body.get("avatarUrl");
        User user = userService.login(openid, nickname, avatarUrl);

        String token = jwtUtil.generateToken(user.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);
        return Result.ok(data);
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
