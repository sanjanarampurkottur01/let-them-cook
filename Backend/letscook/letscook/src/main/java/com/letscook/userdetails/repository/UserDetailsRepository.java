package com.letscook.userdetails.repository;

import com.letscook.userdetails.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDetailsRepository extends JpaRepository<UserInfo, Long> {

    List<UserInfo> findByEmail(String email);

    List<UserInfo> findByEmailAndPassword(String email, String password);
}
