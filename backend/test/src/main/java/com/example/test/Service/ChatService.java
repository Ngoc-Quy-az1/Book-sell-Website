package com.example.test.Service;

import com.example.test.Entity.*;
import com.example.test.Entity.chatEntity.ChatGroup;
import com.example.test.Entity.chatEntity.SupportMessage;
import com.example.test.Repository.UserRepo.UserRepository;
import com.example.test.Repository.chatRepo.ChatGroupRepository;
import com.example.test.Repository.chatRepo.SupportMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private SupportMessageRepository supportMessageRepository;

    @Autowired
    private ChatGroupRepository chatGroupRepository;

    @Autowired
    private UserRepository userRepository;

    public SupportMessage sendPrivateMessage(User sender, User receiver, String message) {
        SupportMessage supportMessage = new SupportMessage();
        supportMessage.setSender(sender);
        supportMessage.setReceiver(receiver);
        supportMessage.setConversationUser(receiver);
        supportMessage.setMessage(message);
        supportMessage.setChatType(SupportMessage.ChatType.PRIVATE);
        supportMessage.setCreatedAt(LocalDateTime.now());
        return supportMessageRepository.save(supportMessage);
    }

    public List<SupportMessage> getPrivateMessages(User user1, User user2) {
        return supportMessageRepository.findBySenderAndReceiver(user1, user2);
        
    }

    public SupportMessage sendGroupMessage(User sender, ChatGroup group, String message) {
        SupportMessage supportMessage = new SupportMessage();
        supportMessage.setSender(sender);
        supportMessage.setChatGroup(group);
        supportMessage.setConversationUser(sender);
        supportMessage.setMessage(message);
        supportMessage.setChatType(SupportMessage.ChatType.GROUP);
        supportMessage.setCreatedAt(LocalDateTime.now());
        return supportMessageRepository.save(supportMessage);
    }

    public List<SupportMessage> getGroupMessages(ChatGroup group) {
        return supportMessageRepository.findByChatGroup(group);
    }

    public ChatGroup findGroupById(Integer groupId) {
        return chatGroupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
    }

    //hàm lấy số lượng tin nhắn được gưỉ tới 1 người dùng
    public int getCountOfMessages(int userId){
        return supportMessageRepository.countByReceiver(userRepository.findUserByID(userId));
    }
}
