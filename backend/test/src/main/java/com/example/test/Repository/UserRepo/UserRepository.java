package com.example.test.Repository.UserRepo;

import com.example.test.Entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findUserByPhone(String phone);

    User findUserByMail(String mail);

    User findUserByID(int ID);

    @Query("SELECT u.id FROM User u WHERE u.mail = :username")
    Integer findIdByUsername(@Param("username") String username);

    @Query("SELECT u.mail FROM User u WHERE u.id = :userId")
    String findNameByUserID(@Param("userId") int userId);
}
