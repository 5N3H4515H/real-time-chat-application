package com.chatapplication.chatserver.controller;

import com.chatapplication.chatserver.config.Model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message") // will get all the message coming from app/message
    @SendTo("/chatroom/public") // will broadcast the msg to chatroom
    public Message receivePublicMessage(@Payload Message message){
        return message;
    }

    @MessageMapping("/private-message") // will get the message of specific user coming from app/private-message
    public Message receivePrivateMessage(@Payload Message message){
        System.out.println(message);
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message); // ex: /user/Harry(It will be dynamic)/private

        return message;
    }
}
