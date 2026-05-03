package com.federico.taskforge.service;

import com.federico.taskforge.domain.entity.User;
import com.federico.taskforge.dto.response.UserResponse;
import com.federico.taskforge.exception.ResourceNotFoundException;
import com.federico.taskforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public Page<UserResponse> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserResponse::from);
    }

    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> ResourceNotFoundException.of("User", id));
        return UserResponse.from(user);
    }
}
