package com.federico.taskforge.dto.request;

import com.federico.taskforge.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(@NotNull TaskStatus status) {}
