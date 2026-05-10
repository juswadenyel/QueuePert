package com.queuepert.backend.service;

import org.springframework.stereotype.Service;

import com.queuepert.backend.entity.AdminEntity;
import com.queuepert.backend.repository.AdminRepository;

@Service
public class AdminService {
    AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public AdminEntity createAdmin(AdminEntity admin) {
        return adminRepository.save(admin);
    }

    public AdminEntity getAdminById(Integer id) {
        return adminRepository.findById(id).orElse(null);
    }
}
