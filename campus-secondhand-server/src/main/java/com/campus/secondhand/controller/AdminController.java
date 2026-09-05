package com.campus.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.*;
import com.campus.secondhand.mapper.*;
import com.campus.secondhand.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserMapper userMapper;
    @Autowired private ProductMapper productMapper;
    @Autowired private OrderInfoMapper orderMapper;
    @Autowired private CategoryService categoryService;
    @Autowired private CategoryMapper categoryMapper;

    // ===== 仪表盘 =====
    @GetMapping("/dashboard")
    public Result<Map<String, Object>> dashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("userCount", userMapper.selectCount(null));
        data.put("productCount", productMapper.selectCount(new LambdaQueryWrapper<Product>().eq(Product::getStatus, "on_sale")));
        data.put("todayOrders", orderMapper.selectCount(
                new LambdaQueryWrapper<OrderInfo>().ge(OrderInfo::getCreateTime, new java.util.Date())));
        data.put("totalAmount", orderMapper.selectList(
                new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getStatus, "received"))
                .stream().map(o -> o.getTotalPrice() != null ? o.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return Result.ok(data);
    }

    // ===== 用户管理 =====
    @GetMapping("/users")
    public Result<Page<User>> getUsers(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        return Result.ok(userMapper.selectPage(
                new Page<>(pageNum, pageSize),
                new LambdaQueryWrapper<User>().orderByDesc(User::getCreateTime)));
    }

    @PutMapping("/users/{id}/status")
    public Result<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User user = userMapper.selectById(id);
        if (user != null) {
            user.setStatus(Integer.valueOf(body.get("status").toString()));
            userMapper.updateById(user);
        }
        return Result.ok();
    }

    // ===== 商品管理（管理员视角） =====
    @GetMapping("/products")
    public Result<Page<Product>> getAdminProducts(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        LambdaQueryWrapper<Product> w = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty())
            w.like(Product::getTitle, keyword);
        if (status != null && !status.isEmpty())
            w.eq(Product::getStatus, status);
        w.orderByDesc(Product::getCreateTime);
        return Result.ok(productMapper.selectPage(new Page<>(pageNum, pageSize), w));
    }

    @DeleteMapping("/products/{id}")
    public Result<?> deleteProduct(@PathVariable Long id) {
        productMapper.deleteById(id);
        return Result.ok();
    }

    // ===== 订单管理（管理员视角） =====
    @GetMapping("/orders")
    public Result<Page<OrderInfo>> getAdminOrders(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String status) {
        LambdaQueryWrapper<OrderInfo> w = new LambdaQueryWrapper<>();
        if (status != null && !status.isEmpty())
            w.eq(OrderInfo::getStatus, status);
        w.orderByDesc(OrderInfo::getCreateTime);
        return Result.ok(orderMapper.selectPage(new Page<>(pageNum, pageSize), w));
    }

    // ===== 分类管理 =====
    @GetMapping("/categories")
    public Result<List<Category>> getAdminCategories() {
        return Result.ok(categoryMapper.selectList(
                new LambdaQueryWrapper<Category>().orderByAsc(Category::getSortOrder)));
    }

    @PostMapping("/categories")
    public Result<Category> createCategory(@RequestBody Category category) {
        categoryService.save(category);
        return Result.ok(category);
    }

    @PutMapping("/categories/{id}")
    public Result<?> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        category.setId(id);
        categoryService.updateById(category);
        return Result.ok();
    }

    @DeleteMapping("/categories/{id}")
    public Result<?> deleteCategory(@PathVariable Integer id) {
        categoryService.removeById(id);
        return Result.ok();
    }

    // ===== 举报管理 =====
    @GetMapping("/reports")
    public Result<Page<Map<String, Object>>> getReports(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        // 简化版：返回模拟举报数据
        List<Map<String, Object>> mockReports = new ArrayList<>();
        Map<String, Object> r1 = new HashMap<>();
        r1.put("id", 1);
        r1.put("reason", "虚假商品");
        r1.put("description", "发布的商品图片与描述严重不符");
        r1.put("status", "pending");
        r1.put("createTime", "2026-07-11 15:30:00");
        mockReports.add(r1);

        Map<String, Object> r2 = new HashMap<>();
        r2.put("id", 2);
        r2.put("reason", "侵权内容");
        r2.put("description", "未经授权出售他人原创作品");
        r2.put("status", "pending");
        r2.put("createTime", "2026-07-10 09:00:00");
        mockReports.add(r2);

        Page<Map<String, Object>> page = new Page<>(pageNum, pageSize);
        page.setRecords(mockReports);
        page.setTotal(mockReports.size());
        return Result.ok(page);
    }

    @PutMapping("/reports/{id}")
    public Result<?> handleReport(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        // 处理举报逻辑
        return Result.ok();
    }
}
