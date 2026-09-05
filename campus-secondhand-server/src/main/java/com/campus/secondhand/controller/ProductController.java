package com.campus.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.*;
import com.campus.secondhand.mapper.ProductImageMapper;
import com.campus.secondhand.mapper.UserMapper;
import com.campus.secondhand.mapper.CategoryMapper;
import com.campus.secondhand.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductImageMapper productImageMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CategoryMapper categoryMapper;

    @GetMapping("/list")
    public Result<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(required = false) String keyword) {
        Page<Product> page = productService.pageOnSale(pageNum, pageSize, categoryId, sort, keyword);
        page.getRecords().forEach(this::enrichProduct);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("records", page.getRecords());
        resultMap.put("total", page.getTotal());
        resultMap.put("pageNum", page.getCurrent());
        resultMap.put("pageSize", page.getSize());
        return Result.ok(resultMap);
    }

    @GetMapping("/{productId}")
    public Result<Product> detail(@PathVariable Long productId) {
        Product product = productService.getDetail(productId);
        if (product == null) return Result.notFound();
        productService.incrViewCount(productId);
        enrichProduct(product);
        return Result.ok(product);
    }

    @PostMapping("/publish")
    public Result<Product> publish(@RequestBody Map<String, Object> body) {
        Product product = new Product();
        product.setTitle((String) body.get("title"));
        product.setDescription((String) body.get("description"));
        product.setPrice(new java.math.BigDecimal(body.get("price").toString()));
        Object op = body.get("originalPrice");
        if (op != null && !"".equals(op.toString()) && !"0".equals(op.toString())) {
            product.setOriginalPrice(new java.math.BigDecimal(op.toString()));
        }
        product.setCategoryId(Integer.valueOf(body.get("categoryId").toString()));
        product.setConditionLevel((String) body.get("conditionLevel"));
        product.setTradeType((String) body.get("tradeType"));
        product.setSellerId(Long.valueOf(body.get("sellerId").toString()));

        @SuppressWarnings("unchecked")
        List<String> images = (List<String>) body.get("images");
        return Result.ok(productService.publish(product, images));
    }

    @GetMapping("/seller/{sellerId}")
    public Result<List<Product>> sellerProducts(
            @PathVariable Long sellerId,
            @RequestParam(required = false) Long excludeId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Product> list = productService.getSellerProducts(sellerId, excludeId, limit);
        list.forEach(this::enrichProduct);
        return Result.ok(list);
    }

    @GetMapping("/my/{userId}")
    public Result<List<Product>> myProducts(@PathVariable Long userId) {
        List<Product> list = productService.getMyProducts(userId);
        list.forEach(this::enrichProduct);
        return Result.ok(list);
    }

    @PutMapping("/{productId}/status")
    public Result<?> updateStatus(@PathVariable Long productId, @RequestBody Map<String, String> body) {
        Product product = productService.getById(productId);
        if (product == null) return Result.notFound();
        product.setStatus(body.get("status"));
        productService.updateById(product);
        return Result.ok();
    }

    /** 填充商品的图片、卖家信息、分类名 */
    private void enrichProduct(Product product) {
        // 1. 图片
        List<ProductImage> imgList = productImageMapper.selectList(
                new LambdaQueryWrapper<ProductImage>()
                        .eq(ProductImage::getProductId, product.getId())
                        .orderByAsc(ProductImage::getSortOrder));
        product.setImages(imgList.stream().map(ProductImage::getUrl).collect(Collectors.toList()));

        // 2. 卖家信息
        User seller = userMapper.selectById(product.getSellerId());
        if (seller != null) {
            Map<String, Object> sellerMap = new HashMap<>();
            sellerMap.put("id", seller.getId());
            sellerMap.put("nickName", seller.getNickname());
            sellerMap.put("avatarUrl", seller.getAvatarUrl());
            sellerMap.put("creditScore", seller.getCreditScore());
            product.setSeller(sellerMap);
        }

        // 3. 分类名称
        Category cat = categoryMapper.selectById(product.getCategoryId());
        if (cat != null) {
            product.setCategoryName(cat.getName());
        }
    }
}
