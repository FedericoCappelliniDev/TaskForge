package com.federico.taskforge.dto.response;

import com.federico.taskforge.domain.entity.Task;
import com.federico.taskforge.domain.enums.TaskPriority;
import com.federico.taskforge.domain.enums.TaskStatus;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
    Long         id,
    String       title,
    String       description,
    TaskStatus   status,
    TaskPriority priority,
    Long         projectId,
    Long         assigneeId,
    LocalDate    dueDate,
    Instant      createdAt,
    Instant      updatedAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getProject().getId(),
            task.getAssignee() != null ? task.getAssignee().getId() : null,
            task.getDueDate(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
}
