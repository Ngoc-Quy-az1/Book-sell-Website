package com.example.test.Repository.OrdersRepo;

import com.example.test.Entity.OrderDetails;
import com.example.test.Entity.OrderDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, OrderDetailsId> {
    @Query("SELECT od FROM OrderDetails od WHERE od.orderId = :orderId")
    List<OrderDetails> findByOrderId(@Param("orderId") Integer orderId);
} 