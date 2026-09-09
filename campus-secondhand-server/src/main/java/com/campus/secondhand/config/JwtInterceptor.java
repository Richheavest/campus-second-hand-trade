package com.campus.secondhand.config;

import com.alibaba.fastjson.JSON;
import com.campus.secondhand.common.Result;
import com.campus.secondhand.common.UserContext;
import com.campus.secondhand.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * JWT 鉴权拦截器：
 * 1. 公开接口（登录 / 分类 / 商品浏览 / 管理后台）直接放行；
 * 2. 其余接口要求携带合法 token，并把 userId 写入 UserContext；
 * 3. token 缺失 / 无效时返回 401（业务码 401，HTTP 仍 200，便于前端统一处理）。
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // CORS 预检请求放行
        if (HttpMethod.OPTIONS.name().equals(request.getMethod())) {
            return true;
        }

        if (isPublic(request)) {
            return true;
        }

        String token = resolveToken(request);
        Long userId = token != null ? jwtUtil.parseUserId(token) : null;
        if (userId == null) {
            writeUnauthorized(response);
            return false;
        }
        UserContext.setUserId(userId);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear();
    }

    /** 公开接口：无需登录即可访问 */
    private boolean isPublic(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (uri.startsWith("/api/admin") || uri.startsWith("/api/category/")) return true;
        if (uri.equals("/api/user/login") || uri.equals("/api/upload")) return true;

        if (HttpMethod.GET.name().equals(method)) {
            if (uri.equals("/api/product/list")) return true;
            if (uri.startsWith("/api/product/seller/")) return true;
            if (uri.matches("/api/product/\\d+")) return true;      // 商品详情（浏览）
            if (uri.matches("/api/order/\\d+")) return true;         // 订单详情（管理后台共用）
        }

        return false;
    }

    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private void writeUnauthorized(HttpServletResponse response) throws Exception {
        response.setStatus(200);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(JSON.toJSONString(Result.unauthorized()));
    }
}
