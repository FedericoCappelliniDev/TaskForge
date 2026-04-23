package com.federico.taskforge.dto.response;

import com.federico.taskforge.domain.entity.Project;
import com.federico.taskforge.domain.enums.ProjectStatus;

import java.time.Instant;
import java.util.List;

public record ProjectResponse(
    Long          id,
    String        name,
    String        description,
    String        color,
    Long          ownerId,
    List<Long>    memberIds,
    long          taskCount,
    long          completedTaskCount,
    ProjectStatus status,
    Instant       createdAt,
    Instant       updatedAt
) {
    public static ProjectResponse from(Project project, long taskCount, long completedTaskCount) {
        return new ProjectResponse(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getColor(),
            project.getOwner().getId(),
            project.getMembers().stream().map(u -> u.getId()).toList(),
            taskCount,
            completedTaskCount,
            project.getStatus(),
            project.getCreatedAt(),
            project.getUpdatedAt()
        );
    }
}
