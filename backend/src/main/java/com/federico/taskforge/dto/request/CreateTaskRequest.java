package com.federico.taskforge.dto.request;

import com.federico.taskforge.domain.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateTaskRequest(
    @NotBlank @Size(max = 300) String title,
                               String description,
    @NotNull                   TaskPriority priority,
    @NotNull                   Long projectId,
                               Long assigneeId,
                               LocalDate dueDate
) {}
