package com.campus.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("order_info")
public class OrderInfo {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long productId;
    private String productTitle;
    private String productImage;
    private Long buyerId;
    private Long sellerId;
    private BigDecimal price;
    private BigDecimal freight;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
