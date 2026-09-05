package com.campus.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.secondhand.entity.Category;
import java.util.List;

public interface CategoryService extends IService<Category> {
    List<Category> listEnabled();
}
