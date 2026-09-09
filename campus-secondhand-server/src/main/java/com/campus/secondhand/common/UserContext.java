package com.campus.secondhand.common;

/**
 * 当前登录用户上下文。
 * 由 JwtInterceptor 在每次请求时写入，业务层通过 {@link #getUserId()} 获取「当前操作者」，
 * 避免信任前端显式传入的 userId（防越权）。
 */
public class UserContext {

    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();

    public static void setUserId(Long userId) {
        USER_ID.set(userId);
    }

    public static Long getUserId() {
        return USER_ID.get();
    }

    public static void clear() {
        USER_ID.remove();
    }
}
