package com.queuepert.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "tbladmin")
public class AdminEntity {
    @Id
    private int adminId;
    private String universityEmail;
    private String password;
    private String firstName;
    private String lastName;
    private char middleInitial;

    public AdminEntity() {
    }

    public AdminEntity(int adminId, String universityEmail, String password, String firstName, String lastName,
            char middleInitial) {
        this.adminId = adminId;
        this.universityEmail = universityEmail;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleInitial = middleInitial;
    }



    public int getAdminId() {
        return adminId;
    }


    public String getUniversityEmail() {
        return universityEmail;
    }



    public String getPassword() {
        return password;
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


    
}
