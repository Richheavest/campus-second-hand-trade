package com.campus.secondhand.service;

import com.campus.secondhand.entity.Product;
import com.campus.secondhand.mapper.ProductMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Set;

/**
 * Redis 服务：商品浏览量 / 收藏量计数 + 商品列表缓存。
 *
 * 设计：
 * - 计数采用「DB 基础值 + Redis 未落库增量」模型：浏览/收藏先打到 Redis（INCR/DECR），
 *   展示时读 DB 基础值再叠加 Redis 增量；定时任务把增量回写 DB 并清空对应 key。
 * - 列表采用 cache-aside：首次查询结果序列化为 JSON 缓存，写操作（发布/改状态）主动失效。
 */
@Slf4j
@Service
public class RedisService {

    private static final String VIEW_KEY_PREFIX = "product:view:";
    private static final String FAV_KEY_PREFIX = "product:fav:";
    private static final String LIST_KEY_PREFIX = "product:list:";

    /** 列表缓存存活时间（秒），兼顾计数实时性与 DB 减压 */
    private static final long LIST_TTL_SECONDS = 300;

    @Autowired
    private StringRedisTemplate redis;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ObjectMapper objectMapper;

    // ===================== 浏览量 =====================

    public void incrView(Long productId) {
        redis.opsForValue().increment(VIEW_KEY_PREFIX + productId);
    }

    // ===================== 收藏量 =====================

    /** 收藏量增减：+1 收藏，-1 取消收藏 */
    public void incrFav(Long productId, long delta) {
        redis.opsForValue().increment(FAV_KEY_PREFIX + productId, delta);
    }

    // ===================== 展示计数（DB 基础值 + Redis 增量） =====================

    /** 用 Redis 实时增量覆盖商品的浏览量 / 收藏量 */
    public void fillRealTimeCounts(Product product) {
        if (product == null) return;
        product.setViewCount(calcCount(VIEW_KEY_PREFIX + product.getId(), product.getViewCount()));
        product.setFavoriteCount(calcCount(FAV_KEY_PREFIX + product.getId(), product.getFavoriteCount()));
    }

    private int calcCount(String key, Integer dbBase) {
        int base = dbBase == null ? 0 : dbBase;
        String delta = redis.opsForValue().get(key);
        return base + (delta == null ? 0 : Integer.parseInt(delta));
    }

    // ===================== 定时回写 DB =====================

    /**
     * 每 5 分钟把 Redis 中的浏览/收藏增量回写到 DB，并清空对应 key。
     */
    @Scheduled(fixedDelay = 300_000)
    public void flushCountersToDb() {
        flushPrefix(VIEW_KEY_PREFIX, true);
        flushPrefix(FAV_KEY_PREFIX, false);
    }

    private void flushPrefix(String prefix, boolean isView) {
        Set<String> keys = redis.keys(prefix + "*");
        if (keys == null || keys.isEmpty()) return;
        for (String key : keys) {
            Long productId;
            try {
                productId = Long.parseLong(key.substring(prefix.length()));
            } catch (NumberFormatException e) {
                continue;
            }
            String v = redis.opsForValue().get(key);
            if (v == null) continue;
            int delta = Integer.parseInt(v);
            if (delta == 0) {
                redis.delete(key);
                continue;
            }
            Product product = productMapper.selectById(productId);
            if (product == null) {
                redis.delete(key);
                continue;
            }
            if (isView) {
                product.setViewCount((product.getViewCount() == null ? 0 : product.getViewCount()) + delta);
            } else {
                product.setFavoriteCount(Math.max(0,
                        (product.getFavoriteCount() == null ? 0 : product.getFavoriteCount()) + delta));
            }
            productMapper.updateById(product);
            redis.delete(key);
        }
    }

    // ===================== 商品列表缓存 =====================

    /** 根据查询条件生成缓存 key */
    public String listCacheKey(int pageNum, int pageSize, Integer categoryId, String sort, String keyword) {
        return LIST_KEY_PREFIX + pageNum + ":" + pageSize + ":" +
                (categoryId == null ? "all" : categoryId) + ":" + sort + ":" +
                (keyword == null ? "" : keyword);
    }

    public Map<String, Object> getListCache(String key) {
        String json = redis.opsForValue().get(key);
        if (json == null) return null;
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.warn("列表缓存反序列化失败, key={}", key, e);
            redis.delete(key);
            return null;
        }
    }

    public void setListCache(String key, Object value) {
        try {
            redis.opsForValue().set(key, objectMapper.writeValueAsString(value), Duration.ofSeconds(LIST_TTL_SECONDS));
        } catch (Exception e) {
            log.warn("列表缓存写入失败, key={}", key, e);
        }
    }

    /** 商品列表写操作后失效所有列表缓存 */
    public void evictListCache() {
        Set<String> keys = redis.keys(LIST_KEY_PREFIX + "*");
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
        }
    }
}
