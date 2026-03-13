package com.example.backend2.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend2.model.CvCompareResponseMessage;
import com.example.backend2.model.CvSuggestResponseMessage;
import com.example.backend2.model.StatusMessage;

@Service
public class MessageService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendStatusMessage(CvCompareResponseMessage cvCompareResponseMessage) {
        rabbitTemplate.convertAndSend("status-queue", cvCompareResponseMessage);
    }

    public void sendSuggestMessage(Long cvId, String suggestions) {
        CvSuggestResponseMessage cvSuggestResponseMessage = new CvSuggestResponseMessage(cvId, suggestions);
        rabbitTemplate.convertAndSend("suggest-response-queue", cvSuggestResponseMessage);
    }
}
