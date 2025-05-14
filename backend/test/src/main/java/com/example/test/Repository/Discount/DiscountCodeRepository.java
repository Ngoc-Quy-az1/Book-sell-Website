package com.example.test.Repository.Discount;

import com.example.test.Entity.DiscountCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscountCodeRepository extends JpaRepository<DiscountCode, Integer> {
    Optional<DiscountCode> findByCode(String code);

    @Query("SELECT d.codeId FROM DiscountCode d WHERE d.code = :code")
    Integer findCodeIdByCode(String code);
}