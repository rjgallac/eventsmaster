package com.example.backend1.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public Queue queue() {
        return new Queue("queue-name", false);
    }

    @Bean
    public Queue cvSuggestQueue() {
        return new Queue("cv-suggest-queue", false);
    }

    @Bean
    public Queue statusQueue() {
        return new Queue("status-queue", false);
    }

    @Bean
    public Queue suggestResponseQueue() {
        return new Queue("suggest-response-queue", false);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange("exchange-name");
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("routing-key");
        
    }

    @Bean
    public Binding cvSuggestBinding(Queue cvSuggestQueue, DirectExchange exchange) {
        return BindingBuilder.bind(cvSuggestQueue).to(exchange).with("cv-suggest-routing-key");
    }

    @Bean
    public Binding statusBinding(Queue statusQueue, DirectExchange exchange) {
        return BindingBuilder.bind(statusQueue).to(exchange).with("status-routing-key");
    }

    @Bean
    public Binding statusQueueBinding(Queue suggestResponseQueue, DirectExchange exchange) {
        return BindingBuilder.bind(suggestResponseQueue).to(exchange).with("suggest-response-routing-key");
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}   