package com.federico.taskforge.controller;

import com.federico.taskforge.domain.enums.TaskPriority;
import com.federico.taskforge.domain.enums.TaskStatus;
import com.federico.taskforge.dto.request.CreateTaskRequest;
import com.federico.taskforge.dto.request.UpdateTaskRequest;
import com.federico.taskforge.dto.request.UpdateTaskStatusRequest;
import com.federico.taskforge.dto.response.TaskResponse;
import com.federico.taskforge.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * GET /api/v1/tasks
     * Query params: projectId, status, priority, assigneeId, page, size, sortBy, direction
     */
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> findAll(
            @RequestParam(required = false) Long         projectId,
            @RequestParam(required = false) TaskStatus   status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) Long         assigneeId,
            @RequestParam(defaultValue = "0")         int    page,
            @RequestParam(defaultValue = "20")         int    size,
            @RequestParam(defaultValue = "createdAt")  String sortBy,
            @RequestParam(defaultValue = "desc")       String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(
            taskService.findAll(projectId, status, priority, assigneeId, pageable));
    }

    /** GET /api/v1/tasks/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    /** POST /api/v1/tasks */
    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(request));
    }

    /** PUT /api/v1/tasks/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(taskService.update(id, request));
    }

    /** PATCH /api/v1/tasks/{id}/status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        return ResponseEntity.ok(taskService.updateStatus(id, request));
    }

    /** DELETE /api/v1/tasks/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
