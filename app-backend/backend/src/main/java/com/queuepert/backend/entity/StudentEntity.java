package com.queuepert.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "tblstudent")
public class StudentEntity {
    @Id
    private String studentId;
    private String universityEmail;
    private String password;
    private String firstName;
    private String lastName;
    private char middleInitial;
    private String course;
    private int yearLevel;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QueueTicketEntity> tickets = new ArrayList<>();

    public StudentEntity() {
    }

    public StudentEntity(String studentId, String universityEmail, String password, String firstName, String lastName, char middleInitial,
            String course, int yearLevel) {
        this.studentId = studentId;
        this.universityEmail = universityEmail;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleInitial = middleInitial;
        this.course = course;
        this.yearLevel = yearLevel;
    }


    public String getStudentId() {
        return studentId;
    }

    public String getPassword() {
        return password;
    }



    public String getUniversityEmail() {
        return universityEmail;
    }




    public String getFirstName() {
        return firstName;
    }




    public String getLastName() {
        return lastName;
    }




    public char getMiddleInitial() {
        return middleInitial;
    }




    public String getCourse() {
        return course;
    }



    public int getYearLevel() {
        return yearLevel;
    }

    public List<QueueTicketEntity> getTickets() {
        return tickets;
    }

    public void setTickets(List<QueueTicketEntity> tickets) {
        this.tickets = tickets;
    }




}
