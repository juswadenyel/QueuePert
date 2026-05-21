package com.queuepert.backend.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblqueueticket")
public class QueueTicketEntity {

    @Id
    private int queueId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "tickets"})
    private AdminEntity admin;

    private String priorityNumber;
    private String transactionType;
    private Double amount;
    private String semester;
    private String status;
    private String counterNumber;
    private LocalDateTime timeCreated;
    private LocalDateTime timeServed;
    private int sortOrder = 0;

    public QueueTicketEntity() {}

    public int getQueueId() { return queueId; }
    public void setQueueId(int queueId) { this.queueId = queueId; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }

    public AdminEntity getAdmin() { return admin; }
    public void setAdmin(AdminEntity admin) { this.admin = admin; }

    public String getStudentId() {
        return student != null ? student.getStudentId() : null;
    }

    public String getAdminId() {
        return admin != null ? String.valueOf(admin.getAdminId()) : null;
    }

    public String getPriorityNumber() { return priorityNumber; }
    public void setPriorityNumber(String priorityNumber) { this.priorityNumber = priorityNumber; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCounterNumber() { return counterNumber; }
    public void setCounterNumber(String counterNumber) { this.counterNumber = counterNumber; }

    public LocalDateTime getTimeCreated() { return timeCreated; }
    public void setTimeCreated(LocalDateTime timeCreated) { this.timeCreated = timeCreated; }

    public LocalDateTime getTimeServed() { return timeServed; }
    public void setTimeServed(LocalDateTime timeServed) { this.timeServed = timeServed; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public String getStudentFullName() {
    if (student == null) return null;
    String mi = student.getMiddleInitial();
    if (mi != null && !mi.trim().isEmpty()) {
        return student.getLastName() + ", " + student.getFirstName() + " " + mi + ".";
    }
    return student.getLastName() + ", " + student.getFirstName();
}

    public String getCourse() { return student != null ? student.getCourse() : null; }
    public Integer getYearLevel() { return student != null ? student.getYearLevel() : null; }
    public String getUniversityEmail() { return student != null ? student.getUniversityEmail() : null; }
}