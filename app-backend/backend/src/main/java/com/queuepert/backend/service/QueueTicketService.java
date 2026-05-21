package com.queuepert.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.queuepert.backend.entity.AdminEntity;
import com.queuepert.backend.entity.QueueTicketEntity;
import com.queuepert.backend.repository.AdminRepository;
import com.queuepert.backend.repository.QueueTicketRepository;


@Service
public class QueueTicketService {

    private final QueueTicketRepository queueTicketRepository;
    private final AdminRepository adminRepository;
    

    public QueueTicketService(
            QueueTicketRepository repo,
            AdminRepository adminRepository
    ) {
        this.queueTicketRepository = repo;
        this.adminRepository = adminRepository;
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

    public List<QueueTicketEntity> getServingTickets() {
        return queueTicketRepository.findByStatusOrderBySortOrderAsc("serving");
    }

    public List<QueueTicketEntity> getTicketsByStudentId(String studentId) {
        return queueTicketRepository.findByStudent_StudentId(studentId);
    }

    public QueueTicketEntity getTicketById(int id) {
        return queueTicketRepository.findById(id).orElse(null);
    }

    public QueueTicketEntity updateStatus(int id, String newStatus, String counterNumber, String adminId) {
        QueueTicketEntity ticket = queueTicketRepository.findById(id).orElse(null);
        if (ticket == null) return null;
        ticket.setStatus(newStatus);
        if (newStatus.equals("serving")) {
            ticket.setTimeServed(LocalDateTime.now());
            if (counterNumber != null) ticket.setCounterNumber(counterNumber);
        }

        if (ticket.getAdmin() == null && adminId != null) {
            AdminEntity admin = adminRepository.findById(adminId)
                    .orElse(null);

            if (admin != null) {
                ticket.setAdmin(admin);
            }
        }

        return queueTicketRepository.save(ticket);
    }

    public QueueTicketEntity updateDetails(int id, Map<String, Object> fields) {
        QueueTicketEntity ticket = queueTicketRepository.findById(id).orElse(null);
        if (ticket == null) return null;
        if (fields.containsKey("transactionType"))
            ticket.setTransactionType((String) fields.get("transactionType"));
        if (fields.containsKey("semester"))
            ticket.setSemester((String) fields.get("semester"));
        if (fields.containsKey("amount") && fields.get("amount") != null)
            ticket.setAmount(Double.parseDouble(fields.get("amount").toString()));
        return queueTicketRepository.save(ticket);
    }

    public QueueTicketEntity cancelTicket(int id) {
        QueueTicketEntity ticket = queueTicketRepository.findById(id).orElse(null);
        if (ticket == null) return null;
        ticket.setStatus("cancelled");
        return queueTicketRepository.save(ticket);
    }

    public void deleteTicket(int id) {
        queueTicketRepository.deleteById(id);
    }

    public void reorderCounter(String counterNumber, List<Integer> queueIds) {
        List<QueueTicketEntity> tickets =
            queueTicketRepository.findByStatusAndCounterNumber("serving", counterNumber);

        for (QueueTicketEntity ticket : tickets) {
            int position = queueIds.indexOf(ticket.getQueueId());
            ticket.setSortOrder(position >= 0 ? position : Integer.MAX_VALUE);
        }

        queueTicketRepository.saveAll(tickets);
    }

    private int generateNextQueueId() {
        return queueTicketRepository.findAll()
            .stream()
            .mapToInt(QueueTicketEntity::getQueueId)
            .max()
            .orElse(0) + 1;
    }

    private String generateNextPriorityNumber() {
        List<QueueTicketEntity> all = queueTicketRepository.findAll();
        if (all.isEmpty()) return "A001";
        String last = all.stream()
            .map(QueueTicketEntity::getPriorityNumber)
            .filter(p -> p != null && p.length() == 4)
            .sorted((a, b) -> {
                if (a.charAt(0) != b.charAt(0)) return a.charAt(0) - b.charAt(0);
                return Integer.parseInt(a.substring(1)) - Integer.parseInt(b.substring(1));
            })
            .reduce((first, second) -> second)
            .orElse("A000");
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

    public long getNoShowCount() {
        return queueTicketRepository.countNoShow();
    }

    public Map<String, Object> getDailyReport(String adminId) {

    LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
    LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

    List<QueueTicketEntity> tickets =
        queueTicketRepository.findByAdmin_AdminIdAndStatusAndTimeServedBetween(
            adminId,
            "done",
            startOfDay,
            endOfDay
        );

    double totalAmount = 0;

    for (QueueTicketEntity ticket : tickets) {
        if (ticket.getAmount() != null) {
            totalAmount += ticket.getAmount();
        }
    }

    Map<String, Object> report = new HashMap<>();

    if (!tickets.isEmpty()) {
        AdminEntity admin = tickets.get(0).getAdmin();

        report.put("adminName",
            admin.getLastName() + ", " +
            admin.getFirstName() + " " +
            admin.getMiddleInitial() + "."
        );

        report.put("adminId", admin.getAdminId());
    }

    report.put("date", LocalDate.now());
    report.put("totalTransactions", tickets.size());
    report.put("totalAmount", totalAmount);
    report.put("tickets", tickets);

    return report;
}
}
