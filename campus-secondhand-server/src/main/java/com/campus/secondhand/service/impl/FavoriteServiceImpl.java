package com.campus.secondhand.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.secondhand.entity.Favorite;
import com.campus.secondhand.entity.Product;
import com.campus.secondhand.mapper.FavoriteMapper;
import com.campus.secondhand.mapper.ProductMapper;
import com.campus.secondhand.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteServiceImpl extends ServiceImpl<FavoriteMapper, Favorite> implements FavoriteService {

    @Autowired
    private ProductMapper productMapper;

    @Override
    @Transactional
    public boolean toggle(Long userId, Long productId) {
        Favorite exist = this.getOne(new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getProductId, productId));

        Product product = productMapper.selectById(productId);

        if (exist != null) {
            // 取消收藏
            this.removeById(exist.getId());
            if (product != null) {
                int count = Math.max(0, (product.getFavoriteCount() == null ? 0 : product.getFavoriteCount()) - 1);
                product.setFavoriteCount(count);
                productMapper.updateById(product);
            }
            return false;
        } else {
            // 添加收藏
            Favorite fav = new Favorite();
            fav.setUserId(userId);
            fav.setProductId(productId);
            this.save(fav);
            if (product != null) {
                product.setFavoriteCount((product.getFavoriteCount() == null ? 0 : product.getFavoriteCount()) + 1);
                productMapper.updateById(product);
            }
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
