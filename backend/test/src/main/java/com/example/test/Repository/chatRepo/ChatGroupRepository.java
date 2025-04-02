package com.example.test.Repository.chatRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.test.Entity.chatEntity.ChatGroup;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Integer> {
}
