package com.example.backend2.consumer;

import java.util.logging.Logger;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend2.model.ProductMessage;
import com.example.backend2.service.MessageService;

@Component
public class ProductConsumer {

    @Autowired
    private MessageService messageService;

    Logger logger = Logger.getLogger(ProductConsumer.class.getName());

    @RabbitListener(queues = "queue-name")
    public void receiveMessage(ProductMessage message) {
        logger.info("Received message: " + message.getName() + " with price: " + message.getPrice() + " and status: " + message.getStatus());
        try {
            Thread.sleep(3000l);
            messageService.sendStatusMessage(message.getId(), "Processed");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

}
