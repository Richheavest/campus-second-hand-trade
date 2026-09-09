package com.campus.secondhand.service;

import cn.hutool.http.HttpUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 微信登录服务：用 wx.login 的 code 调 code2session 换取 openid。
 *
 * 真实链路：code → https://api.weixin.qq.com/sns/jscode2session → openid + session_key。
 * 开发兜底：dev-mode=true 或未配置 appid/secret 时，返回本地 mock openid，
 *          保证没有小程序凭证也能在本地跑通「登录 → 签发 JWT」的完整链路。
 */
@Slf4j
@Service
public class WxService {

    @Value("${wechat.appid:}")
    private String appid;

    @Value("${wechat.secret:}")
    private String secret;

    @Value("${wechat.dev-mode:true}")
    private boolean devMode;

    private static final String CODE2SESSION_URL =
            "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

    public String code2session(String code) {
        if (devMode || isBlank(appid) || isBlank(secret)) {
            log.info("[dev-mode] code={} 使用本地 mock openid 兜底", code);
            return "test_openid_001";
        }

        String url = String.format(CODE2SESSION_URL, appid, secret, code);
        String resp = HttpUtil.get(url, 5000);
        JSONObject json = JSON.parseObject(resp);

        if (json.containsKey("errcode") && json.getIntValue("errcode") != 0) {
            log.error("code2session 失败: {}", resp);
            throw new RuntimeException("微信登录失败: " + json.getString("errmsg"));
        }

        String openid = json.getString("openid");
        if (isBlank(openid)) {
            throw new RuntimeException("微信登录失败: 未获取到 openid");
        }
        return openid;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
