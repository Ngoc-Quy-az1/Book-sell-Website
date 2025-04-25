package com.example.test.Repository.PurchaseHistoryRepo;

import com.example.test.Entity.PurchaseHistory;
import com.example.test.Entity.PurchaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseHistoryRepository extends JpaRepository<PurchaseHistory, Integer> {
    List<PurchaseHistory> findByStatus(PurchaseStatus status);
    List<PurchaseHistory> findByUserIdAndStatus(Integer userId, PurchaseStatus status);
    List<PurchaseHistory> findByUserId(Integer userId);
} 