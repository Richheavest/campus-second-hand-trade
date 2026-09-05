package com.campus.secondhand.controller;

import com.campus.secondhand.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 文件上传接口
 */
@RestController
@RequestMapping("/api")
public class FileController {

    @Value("${upload.path:./uploads/}")
    private String uploadPath;

    @PostMapping("/upload")
    public Result<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return Result.fail("文件不能为空");
        }
        try {
            // 确保上传目录存在（解析为绝对路径，避免相对路径漂移）
            File dir = resolveUploadDir();
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 生成唯一文件名，保留原扩展名
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.lastIndexOf('.') > 0) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = UUID.randomUUID().toString().replace("-", "") + ext;
            File dest = new File(dir, filename);
            file.transferTo(dest);

            // 返回可访问的相对路径（前端会拼上 BASE_URL）
            Map<String, String> data = new HashMap<>();
            data.put("url", "/uploads/" + filename);
            return Result.ok(data);
        } catch (Exception e) {
            return Result.fail("上传失败: " + e.getMessage());
        }
    }

    /**
     * 解析上传目录为绝对路径。
     * 相对路径统一以用户主目录为基准，避免 IDEA 运行时 user.dir 漂移到 Tomcat 临时目录导致写入失败。
     */
    private File resolveUploadDir() {
        File dir = new File(uploadPath);
        if (!dir.isAbsolute()) {
            dir = new File(System.getProperty("user.home"), uploadPath);
        }
        return dir;
    }
}
