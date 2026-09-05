package com.campus.secondhand.controller;

import com.campus.secondhand.common.Result;
import com.campus.secondhand.entity.OrderInfo;
import com.campus.secondhand.entity.OrderStatusLog;
import com.campus.secondhand.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private com.campus.secondhand.mapper.OrderStatusLogMapper statusLogMapper;

    /**
     * 创建订单
     */
    @PostMapping("/create")
    public Result<OrderInfo> create(@RequestBody Map<String, Long> body) {
        Long buyerId = body.get("buyerId");
        Long productId = body.get("productId");
        OrderInfo order = orderService.createOrder(buyerId, productId);
        return Result.ok(order);
    }

    /**
     * 订单列表
     */
    @GetMapping("/list")
    public Result<List<OrderInfo>> list(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "buy") String role,
            @RequestParam(required = false) String status) {
        List<OrderInfo> orders = orderService.getUserOrders(userId, role, status);
        return Result.ok(orders);
    }

    /**
     * 订单详情
     */
    @GetMapping("/{orderId}")
    public Result<Map<String, Object>> detail(@PathVariable Long orderId) {
        OrderInfo order = orderService.getDetail(orderId);
        if (order == null) {
            return Result.notFound();
        }
        // 查询状态时间线
        List<OrderStatusLog> logs = statusLogMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<OrderStatusLog>()
                        .eq(OrderStatusLog::getOrderId, orderId)
                        .orderByAsc(OrderStatusLog::getCreateTime));

        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("statusTimeline", logs);
        return Result.ok(result);
    }

    /**
     * 更新订单状态
     */
    @PutMapping("/{orderId}/status")
    public Result<OrderInfo> updateStatus(@PathVariable Long orderId, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        OrderInfo order = orderService.updateStatus(orderId, newStatus);
        return Result.ok(order);
    }
}
