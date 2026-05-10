package com.queuepert.backend.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "tblqueueticket")
public class QueueTicketEntity {
    @Id
    private int queueId;
    private int studentId;
    private int adminId;
    private String priorityNumber;
    private String transacitonType;
    private String amount;
    private String status;
    private String counterNumber;
    private String timeCreated;
    private String timeServed;


    public QueueTicketEntity(int queueId, int studentId, int adminId, String priorityNumber, String transacitonType,
            String amount, String status, String counterNumber, String timeCreated, String timeServed) {
        this.queueId = queueId;
        this.studentId = studentId;
        this.adminId = adminId;
        this.priorityNumber = priorityNumber;
        this.transacitonType = transacitonType;
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


    public int getStudentId() {
        return studentId;
    }



    public int getAdminId() {
        return adminId;
    }



    public String getPriorityNumber() {
        return priorityNumber;
    }


    public void setPriorityNumber(String priorityNumber) {
        this.priorityNumber = priorityNumber;
    }


    public String getTransacitonType() {
        return transacitonType;
    }


    public void setTransacitonType(String transacitonType) {
        this.transacitonType = transacitonType;
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

