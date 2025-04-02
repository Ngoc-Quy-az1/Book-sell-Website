package com.example.test.Repository.chatRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.test.Entity.chatEntity.GroupMembers;
import com.example.test.Entity.chatEntity.GroupMembersId;
public interface GroupMembersRepository extends JpaRepository<GroupMembers, GroupMembersId> {

    boolean existsById_GroupIdAndId_UserId(int groupId, int userId);
}
