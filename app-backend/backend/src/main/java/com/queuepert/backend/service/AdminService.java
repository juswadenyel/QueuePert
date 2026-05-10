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

    public String loginAdmin(String email, String password) {

    AdminEntity admin = adminRepository.findByUniversityEmail(email);

    if (admin == null) {
        return "EMAIL_NOT_FOUND";
    }

    if (!admin.getPassword().equals(password)) {
        return "INVALID_PASSWORD";
    }

    return "LOGIN_SUCCESS";
}

}
