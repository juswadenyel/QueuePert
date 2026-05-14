package com.queuepert.backend.repository;

import java.util.List;

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
}