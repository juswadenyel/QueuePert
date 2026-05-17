package com.queuepert.backend.service;

import org.springframework.stereotype.Service;

import java.util.List;
import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.repository.QueueTicketRepository;

@Service
public class QueueTicketService {
    QueueTicketRepository queueTicketRepository;

    public QueueTicketService(QueueTicketRepository ticket) {
        this.queueTicketRepository = ticket;
    }

    public QueueTicketEntity createQueueTicket(QueueTicketEntity ticket) {
        return queueTicketRepository.save(ticket);
    }

    public QueueTicketEntity getQueueTicketById(Integer id) {
        return queueTicketRepository.findById(id).orElse(null);
    }

    public List<QueueTicketEntity> getAllTickets() {
        return queueTicketRepository.findAll();
    }
}
