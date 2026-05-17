package com.queuepert.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.service.QueueTicketService;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "http://localhost:3000")
public class QueueTicketController {
    QueueTicketService queueTicketService;

     @PostMapping("/create")
    public QueueTicketEntity createTicket(
        @RequestBody QueueTicketEntity ticket
    ) {
        return queueTicketService.createQueueTicket(ticket);
    }

    @GetMapping("/all")
    public List<QueueTicketEntity> getAllTickets() {
        return queueTicketService.getAllTickets();
    }
}
