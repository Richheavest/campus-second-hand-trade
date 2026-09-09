package com.campus.secondhand.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.secondhand.entity.Favorite;
import com.campus.secondhand.mapper.FavoriteMapper;
import com.campus.secondhand.service.FavoriteService;
import com.campus.secondhand.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteServiceImpl extends ServiceImpl<FavoriteMapper, Favorite> implements FavoriteService {

    @Autowired
    private RedisService redisService;

    @Override
    @Transactional
    public boolean toggle(Long userId, Long productId) {
        Favorite exist = this.getOne(new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getProductId, productId));

        if (exist != null) {
            // 取消收藏：收藏表删记录，Redis 收藏量 -1
            this.removeById(exist.getId());
            redisService.incrFav(productId, -1L);
            return false;
        } else {
            // 添加收藏：收藏表插记录，Redis 收藏量 +1
            Favorite fav = new Favorite();
            fav.setUserId(userId);
            fav.setProductId(productId);
            this.save(fav);
            redisService.incrFav(productId, 1L);
            return true;
        }
    }

    @Override
    public boolean isFavorited(Long userId, Long productId) {
        return this.count(new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getProductId, productId)) > 0;
    }

    @Override
    public List<Favorite> getUserFavorites(Long userId) {
        return this.list(new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .orderByDesc(Favorite::getCreateTime));
    }
}
