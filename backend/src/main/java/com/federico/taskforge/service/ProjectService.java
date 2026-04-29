package com.federico.taskforge.service;

import com.federico.taskforge.domain.entity.Project;
import com.federico.taskforge.domain.entity.User;
import com.federico.taskforge.dto.request.CreateProjectRequest;
import com.federico.taskforge.dto.request.UpdateProjectRequest;
import com.federico.taskforge.dto.response.ProjectResponse;
import com.federico.taskforge.exception.ForbiddenException;
import com.federico.taskforge.exception.ResourceNotFoundException;
import com.federico.taskforge.repository.ProjectRepository;
import com.federico.taskforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository    userRepository;

    public Page<ProjectResponse> findAll(Long userId, Pageable pageable) {
        return projectRepository.findAllByUserId(userId, pageable)
            .map(p -> toResponse(p));
    }

    public ProjectResponse findById(Long id) {
        return toResponse(getProject(id));
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest request, Long ownerId) {
        User owner = getUser(ownerId);
        Project project = Project.builder()
            .name(request.name())
            .description(request.description())
            .color(request.color() != null ? request.color() : "#4f6ef7")
            .owner(owner)
            .build();
        project.getMembers().add(owner); // owner is also a member
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, UpdateProjectRequest request, Long requesterId) {
        Project project = getProject(id);
        assertOwner(project, requesterId);

        if (request.name()        != null) project.setName(request.name());
        if (request.description() != null) project.setDescription(request.description());
        if (request.color()       != null) project.setColor(request.color());
        if (request.status()      != null) project.setStatus(request.status());

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id, Long requesterId) {
        Project project = getProject(id);
        assertOwner(project, requesterId);
        projectRepository.delete(project);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Project getProject(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> ResourceNotFoundException.of("Project", id));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> ResourceNotFoundException.of("User", id));
    }

    private void assertOwner(Project project, Long requesterId) {
        if (!project.getOwner().getId().equals(requesterId)) {
            throw new ForbiddenException("Only the project owner can perform this action.");
        }
    }

    private ProjectResponse toResponse(Project p) {
        long taskCount      = projectRepository.countTasks(p.getId());
        long completedCount = projectRepository.countCompletedTasks(p.getId());
        return ProjectResponse.from(p, taskCount, completedCount);
    }
}
