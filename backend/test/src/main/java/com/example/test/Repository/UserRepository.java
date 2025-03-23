package com.example.test.Repository;

import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
        public User findUserByPhone(String phone);
        public User findUserByMail(String mail);
}
