package com.campus.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.Category;
import com.campus.secondhand.entity.Favorite;
import com.campus.secondhand.entity.Product;
import com.campus.secondhand.entity.ProductImage;
import com.campus.secondhand.entity.User;
import com.campus.secondhand.mapper.CategoryMapper;
import com.campus.secondhand.mapper.ProductImageMapper;
import com.campus.secondhand.mapper.ProductMapper;
import com.campus.secondhand.mapper.UserMapper;
import com.campus.secondhand.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ProductImageMapper productImageMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CategoryMapper categoryMapper;

    /**
     * 切换收藏状态
     */
    @PostMapping("/toggle")
    public Result<Map<String, Object>> toggle(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long productId = body.get("productId");
        boolean isFav = favoriteService.toggle(userId, productId);
        Map<String, Object> result1 = new HashMap<>();
        result1.put("isFavorited", isFav);
        return Result.ok(result1);
    }

    /**
     * 是否已收藏
     */
    @GetMapping("/check")
    public Result<Map<String, Boolean>> check(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        boolean isFav = favoriteService.isFavorited(userId, productId);
        Map<String, Boolean> result2 = new HashMap<>();
        result2.put("isFavorited", isFav);
        return Result.ok(result2);
    }

    /**
     * 用户收藏列表（返回收藏的商品，含图片信息）
     */
    @GetMapping("/list/{userId}")
    public Result<List<Product>> list(@PathVariable Long userId) {
        List<Favorite> favs = favoriteService.getUserFavorites(userId);
        List<Long> productIds = favs.stream().map(Favorite::getProductId).collect(Collectors.toList());
        if (productIds.isEmpty()) {
            return Result.ok(Collections.emptyList());
        }
        List<Product> products = productMapper.selectBatchIds(productIds);
        products.forEach(this::enrichProduct);

        // 保持与收藏时间一致（最近收藏在前）
        Map<Long, Integer> orderMap = new HashMap<>();
        for (int i = 0; i < favs.size(); i++) {
            orderMap.putIfAbsent(favs.get(i).getProductId(), i);
        }
        products.sort(Comparator.comparingInt(p -> orderMap.getOrDefault(p.getId(), Integer.MAX_VALUE)));
        return Result.ok(products);
    }

    /** 填充商品图片、卖家信息、分类名（与 ProductController 保持一致） */
    private void enrichProduct(Product product) {
        List<ProductImage> imgList = productImageMapper.selectList(
                new LambdaQueryWrapper<ProductImage>()
                        .eq(ProductImage::getProductId, product.getId())
                        .orderByAsc(ProductImage::getSortOrder));
        product.setImages(imgList.stream().map(ProductImage::getUrl).collect(Collectors.toList()));

        User seller = userMapper.selectById(product.getSellerId());
        if (seller != null) {
            Map<String, Object> sellerMap = new HashMap<>();
            sellerMap.put("id", seller.getId());
            sellerMap.put("nickName", seller.getNickname());
            sellerMap.put("avatarUrl", seller.getAvatarUrl());
            sellerMap.put("creditScore", seller.getCreditScore());
            product.setSeller(sellerMap);
        }

        Category cat = categoryMapper.selectById(product.getCategoryId());
        if (cat != null) {
            product.setCategoryName(cat.getName());
        }
    }
}
