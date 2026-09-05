package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.OrderInfo;
import java.util.List;

public interface OrderService extends IService<OrderInfo> {

    /**
     * 创建订单
     */
    OrderInfo createOrder(Long buyerId, Long productId);

    /**
     * 更新订单状态
     */
    OrderInfo updateStatus(Long orderId, String newStatus);

    /**
     * 查询用户的订单（买家/卖家）
     */
    List<OrderInfo> getUserOrders(Long userId, String role, String status);

    /**
     * 订单详情
     */
    OrderInfo getDetail(Long orderId);
}
