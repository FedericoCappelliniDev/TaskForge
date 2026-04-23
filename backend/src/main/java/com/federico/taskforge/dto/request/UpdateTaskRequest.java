package com.federico.taskforge.dto.request;

import com.federico.taskforge.domain.enums.TaskPriority;
import com.federico.taskforge.domain.enums.TaskStatus;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTaskRequest(
    @Size(max = 300) String title,
                     String description,
                     TaskStatus status,
                     TaskPriority priority,
                     Long assigneeId,
                     LocalDate dueDate
) {}
