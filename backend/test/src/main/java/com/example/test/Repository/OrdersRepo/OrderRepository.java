package com.example.test.Repository.OrdersRepo;

import com.example.test.Entity.Orders;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByUserId(Integer userId);
} 