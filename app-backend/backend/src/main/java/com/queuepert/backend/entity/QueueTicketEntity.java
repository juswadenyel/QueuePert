package com.queuepert.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblqueueticket")
public class QueueTicketEntity {
    @Id
    @GeneratedValue
    private int queueId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private AdminEntity admin;

    private String priorityNumber;
    private String transactionType;
    private String amount;
    private String status;
    private String counterNumber;
    private String timeCreated;
    private String timeServed;

    public QueueTicketEntity() {
    }

    public QueueTicketEntity(int queueId, StudentEntity student, AdminEntity admin, String priorityNumber, String transactionType,
            String amount, String status, String counterNumber, String timeCreated, String timeServed) {
        this.queueId = queueId;
        this.student = student;
        this.admin = admin;
        this.priorityNumber = priorityNumber;
        this.transactionType = transactionType;
        this.amount = amount;
        this.status = status;
        this.counterNumber = counterNumber;
        this.timeCreated = timeCreated;
        this.timeServed = timeServed;
    }

    public int getQueueId() {
        return queueId;
    }

    public void setQueueId(int queueId) {
        this.queueId = queueId;
    }

    public StudentEntity getStudent() {
        return student;
    }

    public void setStudent(StudentEntity student) {
        this.student = student;
    }

    public AdminEntity getAdmin() {
        return admin;
    }

    public void setAdmin(AdminEntity admin) {
        this.admin = admin;
    }

    // convenience getters for backward compatibility
    public String getStudentId() {
        return student != null ? student.getStudentId() : null;
    }

    public Integer getAdminId() {
        return admin != null ? admin.getAdminId() : null;
    }

    public String getPriorityNumber() {
        return priorityNumber;
    }

    public void setPriorityNumber(String priorityNumber) {
        this.priorityNumber = priorityNumber;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCounterNumber() {
        return counterNumber;
    }

    public void setCounterNumber(String counterNumber) {
        this.counterNumber = counterNumber;
    }

    public String getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(String timeCreated) {
        this.timeCreated = timeCreated;
    }

    public String getTimeServed() {
        return timeServed;
    }

    public void setTimeServed(String timeServed) {
        this.timeServed = timeServed;
    }
}
