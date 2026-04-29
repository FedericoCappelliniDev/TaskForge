package com.federico.taskforge.controller;

import com.federico.taskforge.domain.entity.User;
import com.federico.taskforge.dto.request.CreateProjectRequest;
import com.federico.taskforge.dto.request.UpdateProjectRequest;
import com.federico.taskforge.dto.response.ProjectResponse;
import com.federico.taskforge.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /** GET /api/v1/projects */
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> findAll(
            @AuthenticationPrincipal User principal,
            @RequestParam(defaultValue = "0")         int page,
            @RequestParam(defaultValue = "20")        int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(projectService.findAll(principal.getId(), pageable));
    }

    /** GET /api/v1/projects/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    /** POST /api/v1/projects */
    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal User principal) {

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(projectService.create(request, principal.getId()));
    }

    /** PUT /api/v1/projects/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal User principal) {

        return ResponseEntity.ok(projectService.update(id, request, principal.getId()));
    }

    /** DELETE /api/v1/projects/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal) {

        projectService.delete(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
