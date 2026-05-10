package com.queuepert.backend.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "tblqueueticket")
public class QueueTicketEntity {
    @Id
    @GeneratedValue
    private int queueId;
    private String studentId;
    private String adminId;
    private String priorityNumber;
    private String transactionType;
    private String amount;
    private String status;
    private String counterNumber;
    private String timeCreated;
    private String timeServed;

    public QueueTicketEntity() {
    }

    public QueueTicketEntity(int queueId, String studentId, String adminId, String priorityNumber, String transactionType,
            String amount, String status, String counterNumber, String timeCreated, String timeServed) {
        this.queueId = queueId;
        this.studentId = studentId;
        this.adminId = adminId;
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


    public String getStudentId() {
        return studentId;
    }



    public String getAdminId() {
        return adminId;
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

