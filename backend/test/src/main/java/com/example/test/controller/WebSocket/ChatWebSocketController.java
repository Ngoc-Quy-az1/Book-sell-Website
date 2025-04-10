package com.example.test.controller.WebSocket;

import com.example.test.DTO.chatDTO.WebSocket.ChatMessage;
import com.example.test.Entity.User;
import com.example.test.Entity.chatEntity.ChatGroup;
import com.example.test.Entity.chatEntity.SupportMessage;
import com.example.test.Service.ChatService;
import com.example.test.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    // Handle private messages
    @MessageMapping("/chat.private")
    public void handlePrivateMessage(@Payload ChatMessage chatMessage) {
        // Save message to database
        User sender = userService.findUserByMail(chatMessage.getSender());
        User receiver = userService.findUserByMail(chatMessage.getReceiver());
        
        SupportMessage savedMessage = chatService.sendPrivateMessage(
            sender, 
            receiver, 
            chatMessage.getContent()
        );

        // Send to specific user
        messagingTemplate.convertAndSendToUser(
            chatMessage.getReceiver(),
            "/queue/messages",
            chatMessage
        );
    }

    // Handle group messages
    @MessageMapping("/chat.group")
    public void handleGroupMessage(@Payload ChatMessage chatMessage) {
        // Save message to database
        User sender = userService.findUserByMail(chatMessage.getSender());
        ChatGroup group = chatService.findGroupById(chatMessage.getGroupId());
        
        SupportMessage savedMessage = chatService.sendGroupMessage(
            sender,
            group,
            chatMessage.getContent()
        );

        // Broadcast to all subscribers of the group
        messagingTemplate.convertAndSend(
            "/topic/group." + chatMessage.getGroupId(),
            chatMessage
        );
    }

    // Handle user join
    @MessageMapping("/chat.join")
    public void handleUserJoin(
        @Payload ChatMessage chatMessage,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        
        if (chatMessage.getGroupId() != null) {
            // Broadcast to group
            messagingTemplate.convertAndSend(
                "/topic/group." + chatMessage.getGroupId(),
                chatMessage
            );
        }
    }

    // Handle user leave
    @MessageMapping("/chat.leave")
    public void handleUserLeave(@Payload ChatMessage chatMessage) {
        if (chatMessage.getGroupId() != null) {
            // Broadcast to group
            messagingTemplate.convertAndSend(
                "/topic/group." + chatMessage.getGroupId(),
                chatMessage
            );
        }
    }
} 