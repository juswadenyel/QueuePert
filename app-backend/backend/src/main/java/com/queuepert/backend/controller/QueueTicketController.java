package com.queuepert.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.service.QueueTicketService;

@RestController
@RequestMapping("/queue")
@CrossOrigin(origins = "http://localhost:3000")
public class QueueTicketController {

    private final QueueTicketService queueTicketService;

    public QueueTicketController(QueueTicketService service) {
        this.queueTicketService = service;
    }

    @PostMapping("/request")
    public ResponseEntity<QueueTicketEntity> requestTicket(@RequestBody QueueTicketEntity ticket) {
        return ResponseEntity.ok(queueTicketService.createQueueTicket(ticket));
    }

    @GetMapping("/all")
    public ResponseEntity<List<QueueTicketEntity>> getAllTickets() {
        return ResponseEntity.ok(queueTicketService.getAllTickets());
    }

    @GetMapping("/waiting")
    public ResponseEntity<List<QueueTicketEntity>> getWaitingTickets() {
        return ResponseEntity.ok(queueTicketService.getWaitingTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable int id) {
        QueueTicketEntity ticket = queueTicketService.getTicketById(id);
        if (ticket == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable int id,
            @RequestParam String status,
            @RequestHeader(value = "X-Admin-Id", required = false) Integer adminId) {

        if (adminId == null) {
            return ResponseEntity.status(401).body("Admin login required");
        }
        QueueTicketEntity updated = queueTicketService.updateStatus(id, status);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable int id) {
        queueTicketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}