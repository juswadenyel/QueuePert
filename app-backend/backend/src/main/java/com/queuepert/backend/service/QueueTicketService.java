package com.queuepert.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.repository.QueueTicketRepository;

@Service
public class QueueTicketService {

    private final QueueTicketRepository queueTicketRepository;

    public QueueTicketService(QueueTicketRepository repo) {
        this.queueTicketRepository = repo;
    }

    public QueueTicketEntity createQueueTicket(QueueTicketEntity ticket) {
        ticket.setQueueId(generateNextQueueId());
        ticket.setPriorityNumber(generateNextPriorityNumber());
        ticket.setStatus("waiting");
        ticket.setTimeCreated(LocalDateTime.now());
        return queueTicketRepository.save(ticket);
    }

    public List<QueueTicketEntity> getAllTickets() {
        return queueTicketRepository.findAll();
    }

    public List<QueueTicketEntity> getWaitingTickets() {
        return queueTicketRepository.findByStatus("waiting");
    }

    public QueueTicketEntity getTicketById(int id) {
        return queueTicketRepository.findById(id).orElse(null);
    }

    public QueueTicketEntity updateStatus(int id, String newStatus) {
        QueueTicketEntity ticket = queueTicketRepository.findById(id).orElse(null);
        if (ticket == null) return null;
        ticket.setStatus(newStatus);
        if (newStatus.equals("serving")) {
            ticket.setTimeServed(LocalDateTime.now());
        }
        return queueTicketRepository.save(ticket);
    }

    public void deleteTicket(int id) {
        queueTicketRepository.deleteById(id);
    }

    private int generateNextQueueId() {
        return (int) queueTicketRepository.count() + 1;
    }

    private String generateNextPriorityNumber() {
        String last = queueTicketRepository.findMaxPriorityNumber();
        if (last == null) return "A001";
        char letter = last.charAt(0);
        int number = Integer.parseInt(last.substring(1));
        if (number >= 999) {
            letter = (char)(letter + 1);
            number = 1;
        } else {
            number++;
        }
        return String.format("%c%03d", letter, number);
    }
}