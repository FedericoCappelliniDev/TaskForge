package com.federico.taskforge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
    @NotBlank @Size(max = 200) String name,
                               String description,
    @Pattern(regexp = "^#([0-9a-fA-F]{6})$")
                               String color
) {}
