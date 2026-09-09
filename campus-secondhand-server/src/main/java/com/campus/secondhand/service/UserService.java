package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.User;

public interface UserService extends IService<User> {

    /**
     * 微信登录：按 openid 查用户，不存在则自动注册。
     * openid 由 WxService 通过 code2session 解析（dev-mode 时回退 mock openid）。
     */
    User login(String openid, String nickname, String avatarUrl);

    /**
     * 获取用户信息
     */
    User getUserById(Long userId);
}
