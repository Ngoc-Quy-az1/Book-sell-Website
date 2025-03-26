package com.example.test.Repository.chatRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.test.Entity.chatEntity.GroupJoinRequest;
import com.example.test.Entity.chatEntity.GroupJoinRequest.RequestStatus;

import java.util.List;

@Repository
public interface GroupJoinRequestRepository extends JpaRepository<GroupJoinRequest, Integer> {

    // Tìm tất cả yêu cầu tham gia của một nhóm
    List<GroupJoinRequest> findByGroup_GroupId(int groupId);

    // Tìm yêu cầu tham gia của một người dùng và nhóm với trạng thái "PENDING"
    boolean existsByUser_IDAndGroup_GroupIdAndStatus(int ID, int groupId, RequestStatus status);
}
