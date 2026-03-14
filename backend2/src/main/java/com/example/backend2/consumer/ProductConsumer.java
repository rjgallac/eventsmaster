package com.example.backend2.consumer;

import java.util.logging.Logger;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.ResponseFormat;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.backend2.model.AiResponse;
import com.example.backend2.model.CvCompareMessage;
import com.example.backend2.model.CvCompareResponseMessage;
import com.example.backend2.model.CvSuggestMessage;
import com.example.backend2.service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ProductConsumer {

    private final MessageService messageService;

    private final ChatClient chatClient;

    Logger logger = Logger.getLogger(ProductConsumer.class.getName());

    public ProductConsumer(MessageService messageService, ChatClient chatClient) {
        this.messageService = messageService;
        this.chatClient = chatClient;
    }

    @RabbitListener(queues = "queue-name")
    public void receiveMessage(CvCompareMessage message) {
        // logger.info("Received message: " + message.getCvContent());
        StringBuilder sb = new StringBuilder();
        sb.append("can you extract the salary , position, company and location from this text please");
        sb.append("Job Description: " + message.getJobSpecContent());
      
        StringBuilder sb2 = new StringBuilder();
        sb2.append("Compare the following CV content with the job description and provide a score from 0 to 100, where 100 means a perfect match.");
        sb2.append("Job Description: " + message.getJobSpecContent());
        sb2.append("CV Content: " + message.getCvContent());

        OpenAiChatOptions options = OpenAiChatOptions.builder()
            .responseFormat(
                ResponseFormat.builder()
                .type(ResponseFormat.Type.JSON_SCHEMA)
                .jsonSchema("{\"type\":\"object\",\"properties\":{\"company\":{\"type\":\"string\"},\"salary\":{\"type\":\"string\"},\"title\":{\"type\":\"string\"},\"location\":{\"type\":\"string\"}},\"required\":[\"company\",\"salary\",\"title\",\"location\"]}")
                .build())
            .temperature(0.0)    
            .maxTokens(5000)
            .frequencyPenalty(0.0)
            .build();

        OpenAiChatOptions options2 = OpenAiChatOptions.builder()
            .responseFormat(
                ResponseFormat.builder()
                .type(ResponseFormat.Type.JSON_SCHEMA)
                .jsonSchema("{\"type\":\"object\",\"properties\":{\"score\":{\"type\":\"number\"}}}}")
                .build())
            .build();

        AiResponse aiResponse = chatClient
            .prompt(sb.toString())
            .options(options)
            .call()
            .entity(AiResponse.class);

         AiResponse aiResponse2 = chatClient
            .prompt(sb2.toString())
            .options(options2)
            .call()
            .entity(AiResponse.class);

        
        logger.info("Extracted AI Response: " + aiResponse2.getScore() + ", " + aiResponse.getCompany() + ", " + aiResponse.getSalary() + ", " + aiResponse.getTitle() + ", " + aiResponse.getLocation());
        logger.info("================================");

      
        CvCompareResponseMessage responseMessage = new CvCompareResponseMessage(
            message.getJobSpecId(),
            aiResponse2.getScore(),
            aiResponse.getCompany(),
            aiResponse.getSalary(),
            aiResponse.getTitle(),
            aiResponse.getLocation()
        );

        messageService.sendStatusMessage(responseMessage);
        
    }

    @RabbitListener(queues = "cv-suggest-queue")
    public void receiveSuggestMessage(CvSuggestMessage cvSuggestMessage) {
        // logger.info("Received suggest message: " + cvSuggestMessage.getCvContent());
        // Process the message and generate suggestions
        StringBuilder suggestions = new StringBuilder();
        suggestions.append("Recommend improvements for the following CV please");
        suggestions.append("CV Content: " + cvSuggestMessage.getCvContent());
        String aiResponse = chatClient
            .prompt(suggestions.toString())
            .call().content();


        // logger.info("Generated suggestions: " + suggestions);
        // Send the suggestions back to the first service
        messageService.sendSuggestMessage(cvSuggestMessage.getCvId(), aiResponse);
    }

}
