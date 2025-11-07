package com.innowise.authenticatioservice.repository;

import com.innowise.authenticatioservice.dto.UserNameDto;
import com.innowise.authenticatioservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<UserNameDto> findByIdIn(List<Long> userIds);
}
