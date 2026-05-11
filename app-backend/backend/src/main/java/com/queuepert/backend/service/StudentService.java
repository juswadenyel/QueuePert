package com.queuepert.backend.service;

import org.springframework.stereotype.Service;

import com.queuepert.backend.entity.StudentEntity;
import com.queuepert.backend.repository.StudentRepository;


@Service
public class StudentService {

    StudentRepository studentRepository;
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentEntity createStudent(StudentEntity student) {
        return studentRepository.save(student);
    }

    public StudentEntity getStudentById(String id) {
        return studentRepository.findById(id).orElse(null);
    }
    
    // LOGIN METHOD
    public StudentEntity loginStudent(String email, String password) {

    StudentEntity student = studentRepository.findByUniversityEmail(email);

        if (student == null) {
            return null;
        }

        if (!student.getPassword().equals(password)) {
            return null;
        }

        return student;
    }
}

