package com.queuepert.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "tbladmin")
public class AdminEntity {
    @Id
    private String adminId;
    private String universityEmail;
    private String password;
    private String firstName;
    private String lastName;
    private char middleInitial;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QueueTicketEntity> tickets = new ArrayList<>();

    public AdminEntity() {
    }

    public AdminEntity(String adminId, String universityEmail, String password, String firstName, String lastName,
            char middleInitial) {
        this.adminId = adminId;
        this.universityEmail = universityEmail;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleInitial = middleInitial;
    }



    public String getAdminId() {
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

    public List<QueueTicketEntity> getTickets() {
        return tickets;
    }

    public void setTickets(List<QueueTicketEntity> tickets) {
        this.tickets = tickets;
    }


    
}
