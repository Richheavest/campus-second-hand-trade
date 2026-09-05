package com.campus.secondhand.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * 跨域配置 & 静态资源映射
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${upload.path:./uploads/}")
    private String uploadPath;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将 /uploads/** 映射到本地 uploads 目录，用于访问上传的商品图片
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resolveUploadLocation());
    }

    /**
     * 解析上传目录为 file: 资源路径，与 FileController 保持一致。
     */
    private String resolveUploadLocation() {
        File dir = new File(uploadPath);
        if (!dir.isAbsolute()) {
            dir = new File(System.getProperty("user.home"), uploadPath);
        }
        String path = dir.getAbsolutePath().replace('\\', '/');
        if (!path.endsWith("/")) {
            path += "/";
        }
        return "file:" + path;
    }
}
