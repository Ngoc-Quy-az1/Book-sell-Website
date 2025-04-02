package com.example.test.Repository.UserRepo;

import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPendingRepository extends JpaRepository<pendingUser, Integer> {
    pendingUser findUserByPhone(String phone);
    pendingUser findUserByMail(String mail);
    void delete(pendingUser user);
}
