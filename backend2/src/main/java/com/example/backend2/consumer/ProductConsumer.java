package com.example.backend2.consumer;

import java.util.logging.Logger;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.backend2.model.ProductMessage;

@Component
public class ProductConsumer {

    Logger logger = Logger.getLogger(ProductConsumer.class.getName());

    @RabbitListener(queues = "queue-name")
    public void receiveMessage(ProductMessage message) {
        logger.info("Received message: " + message.getName() + " with price: " + message.getPrice() + " and status: " + message.getStatus());
    }

}
