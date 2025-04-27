package com.example.test.Repository.chatRepo;
import com.example.test.Entity.User;
import com.example.test.Entity.chatEntity.ChatGroup;
import com.example.test.Entity.chatEntity.SupportMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Integer> {
    List<SupportMessage> findBySenderAndReceiver(User sender, User receiver);
    List<SupportMessage> findByChatGroup(ChatGroup chatGroup);
    List<SupportMessage> findBySender(User sender);
    List<SupportMessage> findByReceiver(User receiver);
    int countByReceiver(User receiver);
}
