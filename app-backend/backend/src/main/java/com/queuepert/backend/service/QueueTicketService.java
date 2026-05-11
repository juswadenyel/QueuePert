package com.queuepert.backend.service;

import org.springframework.stereotype.Service;

import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.repository.QueueTicketRepository;

@Service
public class QueueTicketService {
    QueueTicketRepository queueTicketRepository;

    public QueueTicketService(QueueTicketRepository ticket) {
        this.queueTicketRepository = ticket;
    }

    public QueueTicketRepository createQueueTicket(QueueTicketEntity ticket) {
        return queueTicketRepository.save(ticket);
    }
}
