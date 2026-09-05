package com.campus.secondhand.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.secondhand.entity.*;
import com.campus.secondhand.mapper.*;
import com.campus.secondhand.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderInfoMapper, OrderInfo> implements OrderService {

    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ProductImageMapper productImageMapper;
    @Autowired
    private OrderStatusLogMapper statusLogMapper;

    @Override
    @Transactional
    public OrderInfo createOrder(Long buyerId, Long productId) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new IllegalArgumentException("商品不存在");
        }
        if (!"on_sale".equals(product.getStatus())) {
            throw new IllegalArgumentException("商品已下架或已售");
        }
        if (product.getSellerId().equals(buyerId)) {
            throw new IllegalArgumentException("不能购买自己的商品");
        }

        // 获取商品首图
        ProductImage firstImage = productImageMapper.selectOne(
                new LambdaQueryWrapper<ProductImage>()
                        .eq(ProductImage::getProductId, productId)
                        .orderByAsc(ProductImage::getSortOrder)
                        .last("LIMIT 1"));

        // 创建订单
        OrderInfo order = new OrderInfo();
        order.setOrderNo(generateOrderNo());
        order.setProductId(product.getId());
        order.setProductTitle(product.getTitle());
        order.setProductImage(firstImage != null ? firstImage.getUrl() : "");
        order.setBuyerId(buyerId);
        order.setSellerId(product.getSellerId());
        order.setPrice(product.getPrice());
        order.setFreight(BigDecimal.ZERO);
        order.setTotalPrice(product.getPrice());
        order.setStatus("pending");
        this.save(order);

        // 记录状态日志
        addStatusLog(order.getId(), "pending", "订单创建");

        // 更新商品状态为已售
        product.setStatus("sold");
        productMapper.updateById(product);

        return order;
    }

    @Override
    @Transactional
    public OrderInfo updateStatus(Long orderId, String newStatus) {
        OrderInfo order = this.getById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }

        // 状态流转校验
        String currentStatus = order.getStatus();
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new IllegalArgumentException("非法状态变更");
        }

        order.setStatus(newStatus);
        this.updateById(order);

        // 记录状态日志
        String remark = getStatusRemark(newStatus);
        addStatusLog(orderId, newStatus, remark);

        // 如果取消订单，恢复商品状态
        if ("cancelled".equals(newStatus)) {
            Product product = productMapper.selectById(order.getProductId());
            if (product != null) {
                product.setStatus("on_sale");
                productMapper.updateById(product);
            }
        }

        return order;
    }

    @Override
    public List<OrderInfo> getUserOrders(Long userId, String role, String status) {
        LambdaQueryWrapper<OrderInfo> wrapper = new LambdaQueryWrapper<>();
        if ("buy".equals(role)) {
            wrapper.eq(OrderInfo::getBuyerId, userId);
        } else {
            wrapper.eq(OrderInfo::getSellerId, userId);
        }
        if (status != null && !"all".equals(status)) {
            wrapper.eq(OrderInfo::getStatus, status);
        }
        wrapper.orderByDesc(OrderInfo::getCreateTime);
        return this.list(wrapper);
    }

    @Override
    public OrderInfo getDetail(Long orderId) {
        return this.getById(orderId);
    }

    private String generateOrderNo() {
        return LocalDateTime.now().toString().replaceAll("[-:T.]", "").substring(0, 14)
                + RandomUtil.randomNumbers(6);
    }

    private void addStatusLog(Long orderId, String status, String remark) {
        OrderStatusLog log = new OrderStatusLog();
        log.setOrderId(orderId);
        log.setStatus(status);
        log.setRemark(remark);
        statusLogMapper.insert(log);
    }

    private boolean isValidTransition(String from, String to) {
        switch (from) {
            case "pending": return "paid".equals(to) || "cancelled".equals(to);
            case "paid": return "shipped".equals(to);
            case "shipped": return "received".equals(to);
            default: return false;
        }
    }

    private String getStatusRemark(String status) {
        switch (status) {
            case "paid": return "买家已付款";
            case "shipped": return "卖家已发货";
            case "received": return "买家已收货";
            case "cancelled": return "订单已取消";
            default: return "";
        }
    }
}
