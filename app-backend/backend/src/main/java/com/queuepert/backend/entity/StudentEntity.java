package com.queuepert.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

@Entity
@Table(name = "tblstudent")
public class StudentEntity {

    @Id
    private String studentId;
    private String universityEmail;

    // CHANGED: was @JsonIgnore which blocked both reading AND writing password
    // WRITE_ONLY means frontend CAN send password (for login) but server NEVER returns it
    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;

    private String firstName;
    private String lastName;

    // CHANGED: char → String to avoid null character '\u0000'
    private String middleInitial;

    private String course;
    private int yearLevel;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QueueTicketEntity> tickets = new ArrayList<>();

    public StudentEntity() {}

    public StudentEntity(String studentId, String universityEmail, String password,
            String firstName, String lastName, String middleInitial,
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

    public String getStudentId() { return studentId; }
    public String getUniversityEmail() { return universityEmail; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getMiddleInitial() { return middleInitial; }
    public String getCourse() { return course; }
    public int getYearLevel() { return yearLevel; }
    public List<QueueTicketEntity> getTickets() { return tickets; }
    public void setTickets(List<QueueTicketEntity> tickets) { this.tickets = tickets; }
}