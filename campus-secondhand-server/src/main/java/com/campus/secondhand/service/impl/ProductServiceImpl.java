package com.campus.secondhand.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.secondhand.entity.Product;
import com.campus.secondhand.entity.ProductImage;
import com.campus.secondhand.mapper.ProductImageMapper;
import com.campus.secondhand.mapper.ProductMapper;
import com.campus.secondhand.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Autowired
    private ProductImageMapper productImageMapper;

    @Override
    public Page<Product> pageOnSale(int pageNum, int pageSize, Integer categoryId, String sort, String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, "on_sale");

        // 分类筛选
        if (categoryId != null && categoryId > 0) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Product::getTitle, keyword)
                           .or().like(Product::getDescription, keyword));
        }

        // 排序
        if ("price_asc".equals(sort)) {
            wrapper.orderByAsc(Product::getPrice);
        } else if ("price_desc".equals(sort)) {
            wrapper.orderByDesc(Product::getPrice);
        } else {
            // 默认：最新发布
            wrapper.orderByDesc(Product::getCreateTime);
        }

        return this.page(new Page<>(pageNum, pageSize), wrapper);
    }

    @Override
    @Transactional
    public Product publish(Product product, List<String> images) {
        product.setViewCount(0);
        product.setFavoriteCount(0);
        product.setStatus("on_sale");
        this.save(product);

        // 保存图片
        if (images != null) {
            for (int i = 0; i < images.size(); i++) {
                ProductImage img = new ProductImage();
                img.setProductId(product.getId());
                img.setUrl(images.get(i));
                img.setSortOrder(i);
                productImageMapper.insert(img);
            }
        }
        return product;
    }

    @Override
    public Product getDetail(Long productId) {
        return this.getById(productId);
    }

    @Override
    public List<Product> getSellerProducts(Long sellerId, Long excludeId, int limit) {
        return this.list(new LambdaQueryWrapper<Product>()
                .eq(Product::getSellerId, sellerId)
                .eq(Product::getStatus, "on_sale")
                .ne(excludeId != null, Product::getId, excludeId)
                .orderByDesc(Product::getCreateTime)
                .last("LIMIT " + limit));
    }

    @Override
    public List<Product> getMyProducts(Long userId) {
        return this.list(new LambdaQueryWrapper<Product>()
                .eq(Product::getSellerId, userId)
                .orderByDesc(Product::getCreateTime));
    }
}
