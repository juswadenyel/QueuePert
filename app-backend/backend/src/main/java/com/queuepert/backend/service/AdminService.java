package com.queuepert.backend.service;

import java.util.Map;

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

    public AdminEntity getAdminById(String id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Map<String, Object> loginAdmin(String email, String password) {
        AdminEntity admin = adminRepository.findByUniversityEmail(email);

        if (admin == null) {
            return Map.of("success", false, "message", "Email not found");
        }
        if (!admin.getPassword().equals(password)) {
            return Map.of("success", false, "message", "Incorrect password");
        }

        return Map.of(
            "success", true,
            "adminId", admin.getAdminId(),
            "firstName", admin.getFirstName(),
            "lastName", admin.getLastName()
        );
    }
}