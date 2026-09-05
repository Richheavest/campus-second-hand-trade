package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.User;

public interface UserService extends IService<User> {

    /**
     * 微信登录（Mock模式：用openid查用户，不存在则自动注册）
     */
    User login(String openid, String nickname, String avatarUrl);

    /**
     * 获取用户信息
     */
    User getUserById(Long userId);
}
