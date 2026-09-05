package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.Favorite;
import java.util.List;

public interface FavoriteService extends IService<Favorite> {

    /**
     * 切换收藏状态
     */
    boolean toggle(Long userId, Long productId);

    /**
     * 是否已收藏
     */
    boolean isFavorited(Long userId, Long productId);

    /**
     * 用户收藏列表
     */
    List<Favorite> getUserFavorites(Long userId);
}
