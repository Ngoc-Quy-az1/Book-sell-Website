package com.example.test.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.test.Entity.DeletedToken;

import java.util.Optional;

public interface DeletedTokenRepository extends JpaRepository<DeletedToken, Integer> {
    boolean existsByToken(String token);
}
