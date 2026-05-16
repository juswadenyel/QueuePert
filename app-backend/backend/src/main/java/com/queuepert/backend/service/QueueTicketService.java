package com.queuepert.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.repository.QueueTicketRepository;
import com.queuepert.backend.repository.StudentRepository;  

@Service
public class QueueTicketService {

    private final QueueTicketRepository queueTicketRepository;
    private final StudentRepository studentRepository; 

    public QueueTicketService(QueueTicketRepository repo, StudentRepository studentRepository) { 
        this.queueTicketRepository = repo;
        this.studentRepository = studentRepository; 
    }

    public QueueTicketEntity createQueueTicket(QueueTicketEntity ticket) {
        if (ticket.getStudent() != null && ticket.getStudent().getStudentId() != null) {
            studentRepository.findById(ticket.getStudent().getStudentId())
                .ifPresent(ticket::setStudent);
        }
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

    public List<QueueTicketEntity> getServingTickets() {
        return queueTicketRepository.findByStatus("serving");
    }

    public List<QueueTicketEntity> getTicketsByStudentId(String studentId) {
        return queueTicketRepository.findByStudent_StudentId(studentId);
    }

    public QueueTicketEntity getTicketById(int id) {
        return queueTicketRepository.findById(id).orElse(null);
    }

    public QueueTicketEntity updateStatus(int id, String newStatus, String counterNumber) {
        QueueTicketEntity ticket = queueTicketRepository.findById(id).orElse(null);
        if (ticket == null) return null;
        ticket.setStatus(newStatus);
        if (newStatus.equals("serving")) {
            ticket.setTimeServed(LocalDateTime.now());
            if (counterNumber != null) ticket.setCounterNumber(counterNumber);
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