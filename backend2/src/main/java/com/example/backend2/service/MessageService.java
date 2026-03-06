package com.example.backend2.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend2.model.StatusMessage;

@Service
public class MessageService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendStatusMessage(String id, String status) {
        StatusMessage statusMessage = new StatusMessage(id, status);
        rabbitTemplate.convertAndSend("status-queue", statusMessage);
    }

}
