package com.queuepert.backend.repository;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.queuepert.backend.entity.QueueTicketEntity;

@Repository
public interface QueueTicketRepository extends JpaRepository<QueueTicketEntity, Integer> {

    List<QueueTicketEntity> findByStatus(String status);

    List<QueueTicketEntity> findByStudent_StudentId(String studentId);

    @Query("SELECT MAX(q.priorityNumber) FROM QueueTicketEntity q")
    String findMaxPriorityNumber();

    @Query("SELECT COUNT(q) FROM QueueTicketEntity q WHERE q.status = 'noshow'")
    long countNoShow();

    List<QueueTicketEntity> findByAdmin_AdminIdAndStatusAndTimeServedBetween(
        String adminId,
        String status,
        LocalDateTime start,
        LocalDateTime end
    );
    
}