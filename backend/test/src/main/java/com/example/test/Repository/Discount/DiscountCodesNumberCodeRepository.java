package com.example.test.Repository.Discount;

import com.example.test.Entity.DiscountCodesNumberCode;
import com.example.test.Entity.DiscountCodesNumberCodeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountCodesNumberCodeRepository
                extends JpaRepository<DiscountCodesNumberCode, DiscountCodesNumberCodeId> {
        List<DiscountCodesNumberCode> findByUserId(Integer userId);

        @Query("SELECT d FROM DiscountCodesNumberCode d WHERE d.userId = :userId AND d.discountCode.codeId = :codeid")
        Optional<DiscountCodesNumberCode> findByUserIdAndDiscountCode_Code(Integer userId, Integer codeid);

        @Query("SELECT d FROM DiscountCodesNumberCode d WHERE d.userId = :userId AND d.discountCode.codeId = :codeId")
        DiscountCodesNumberCode findByUserIdAndDiscountCode_CodeId(Integer userId, Integer codeId);

        @Modifying
        @Query("UPDATE DiscountCodesNumberCode d SET d.numberCode = :numberCode WHERE d.userId = :userId AND d.discountCode.codeId = :codeId")
        void updateNumberCode(@Param("userId") Integer userId, @Param("codeId") Integer codeId,
                        @Param("numberCode") Integer numberCode);

        boolean existsByUserIdAndCodeId(Integer userId, Integer codeId);
}