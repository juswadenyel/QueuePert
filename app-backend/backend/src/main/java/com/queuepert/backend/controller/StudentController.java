package com.queuepert.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queuepert.backend.entity.StudentEntity;
import com.queuepert.backend.service.StudentService;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    StudentService studentService;

     public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/login")
    public String loginStudent(@RequestBody StudentEntity student) {

        return studentService.loginStudent(
            student.getUniversityEmail(),
            student.getPassword()
        );
    }
}

