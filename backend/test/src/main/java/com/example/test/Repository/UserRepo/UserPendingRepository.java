package com.example.test.Repository.UserRepo;

import com.example.test.Entity.pendingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPendingRepository extends JpaRepository<pendingUser, Integer> {
    pendingUser findUserByPhone(String phone);
    pendingUser findUserByMail(String mail);
    void delete(pendingUser user);
}
