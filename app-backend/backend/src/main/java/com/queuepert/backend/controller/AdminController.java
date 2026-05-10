package com.queuepert.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queuepert.backend.entity.AdminEntity;
import com.queuepert.backend.service.AdminService;


@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    AdminService adminService;

     public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public String loginAdmin(@RequestBody AdminEntity admin) {

        return adminService.loginAdmin(
            admin.getUniversityEmail(),
            admin.getPassword()
        );
    }

}
