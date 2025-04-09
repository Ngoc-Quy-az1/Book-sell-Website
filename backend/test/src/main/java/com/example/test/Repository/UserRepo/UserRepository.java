package com.example.test.Repository.UserRepo;

import com.example.test.Entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
         User findUserByPhone(String phone);
         User findUserByMail(String mail);
         User findUserByID(int ID);
}
