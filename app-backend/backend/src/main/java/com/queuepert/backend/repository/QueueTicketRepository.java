package com.queuepert.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.queuepert.backend.entity.QueueTicketEntity;

@Repository
public interface QueueTicketRepository extends JpaRepository<QueueTicketEntity, Integer> {

}
