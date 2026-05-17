package com.queuepert.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    // Existing login endpoint — no changes here
    @PostMapping("/login")
    public StudentEntity loginStudent(@RequestBody StudentEntity student) {
        return studentService.loginStudent(
            student.getUniversityEmail(),
            student.getPassword()
        );
    }

    // NEW — look up a student by their ID number
    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable String studentId) {
        StudentEntity student = studentService.getStudentById(studentId);
        if (student == null) {
            return ResponseEntity.status(404).body("Student not found");
        }
        return ResponseEntity.ok(student);
    }
}