package com.campus.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@TableName("product")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer categoryId;
    private String conditionLevel;
    private String tradeType;
    private Long sellerId;
    private String status;
    private Integer viewCount;
    private Integer favoriteCount;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    /** 非数据库字段 - 图片URL列表 */
    @TableField(exist = false)
    private List<String> images;

    /** 非数据库字段 - 卖家信息 */
    @TableField(exist = false)
    private Map<String, Object> seller;

    /** 非数据库字段 - 分类名称 */
    @TableField(exist = false)
    private String categoryName;
}
