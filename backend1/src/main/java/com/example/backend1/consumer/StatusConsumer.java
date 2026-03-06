package com.example.backend1.consumer;

import java.util.logging.Logger;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.backend1.model.StatusMessage;

@Component
public class StatusConsumer {

    Logger logger = Logger.getLogger(StatusConsumer.class.getName());

    @RabbitListener(queues = "status-queue")
    public void receiveMessage(StatusMessage message) {
        logger.info("Received status message: " + message.getId() + " with status: " + message.getStatus());
        
    }
}
