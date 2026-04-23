package com.federico.taskforge.dto.response;

import com.federico.taskforge.domain.entity.User;
import com.federico.taskforge.domain.enums.UserRole;

import java.time.Instant;

public record UserResponse(
    Long      id,
    String    email,
    String    firstName,
    String    lastName,
    UserRole  role,
    String    avatarUrl,
    Instant   createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            user.getAvatarUrl(),
            user.getCreatedAt()
        );
    }
}
