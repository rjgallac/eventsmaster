package com.example.backend1.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend1.model.Product;
import com.example.backend1.model.ProductDto;
import com.example.backend1.model.ProductMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private Map<String, Product> productMap =new HashMap<>();

    Logger logger = Logger.getLogger(TestController.class.getName());

    @GetMapping("/getProducts")
    public String getProducts() {
        return productMap.values().toString();
    }


    @PostMapping("/addProduct")
    public String addProduct(@RequestBody ProductDto productDto) {
        Product product = new Product(productDto.getId(), productDto.getName(), productDto.getPrice());
        productMap.put(productDto.getId(), product);
        //sends async msg to rabbitmq to notify other services about the new product
        ProductMessage productMessage = new ProductMessage(product.getId(), product.getName(), product.getPrice(), product.getStatus());
        rabbitTemplate.convertAndSend("queue-name", productMessage);
        // rabbitTemplate.convertAndSend("queue-name", "hi");
        logger.info("Product added: " + product.getName() + " with price: " + product.getPrice() + " and status: " + product.getStatus());
        return "Product added successfully";
    }
    

}
