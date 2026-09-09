package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.Product;
import java.util.List;

public interface ProductService extends IService<Product> {

    /**
     * 分页查询在售商品
     */
    Page<Product> pageOnSale(int pageNum, int pageSize, Integer categoryId, String sort, String keyword);

    /**
     * 发布商品
     */
    Product publish(Product product, List<String> images);

    /**
     * 获取商品详情（含图片）
     */
    Product getDetail(Long productId);

    /**
     * 卖家的其他在售商品
     */
    List<Product> getSellerProducts(Long sellerId, Long excludeId, int limit);

    /**
     * 我发布的商品
     */
    List<Product> getMyProducts(Long userId);
}
