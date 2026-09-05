package com.campus.secondhand.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.secondhand.entity.User;
import com.campus.secondhand.mapper.UserMapper;
import com.campus.secondhand.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User login(String openid, String nickname, String avatarUrl) {
        User user = this.getOne(new LambdaQueryWrapper<User>().eq(User::getOpenid, openid));
        if (user == null) {
            // 新用户自动注册
            user = new User();
            user.setOpenid(openid);
            user.setNickname(nickname != null ? nickname : "校园用户");
            user.setAvatarUrl(avatarUrl);
            user.setCreditScore(100);
            user.setStatus(1);
            this.save(user);
        } else {
            // 更新用户信息
            if (nickname != null) user.setNickname(nickname);
            if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
            this.updateById(user);
        }
        return user;
    }

    @Override
    public User getUserById(Long userId) {
        return this.getById(userId);
    }
}
