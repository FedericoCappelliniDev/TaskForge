package com.federico.taskforge.service;

import com.federico.taskforge.domain.entity.Project;
import com.federico.taskforge.domain.entity.Task;
import com.federico.taskforge.domain.entity.User;
import com.federico.taskforge.domain.enums.TaskPriority;
import com.federico.taskforge.domain.enums.TaskStatus;
import com.federico.taskforge.dto.request.CreateTaskRequest;
import com.federico.taskforge.dto.request.UpdateTaskRequest;
import com.federico.taskforge.dto.request.UpdateTaskStatusRequest;
import com.federico.taskforge.dto.response.TaskResponse;
import com.federico.taskforge.exception.ResourceNotFoundException;
import com.federico.taskforge.repository.ProjectRepository;
import com.federico.taskforge.repository.TaskRepository;
import com.federico.taskforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository    taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository    userRepository;

    public Page<TaskResponse> findAll(
            Long projectId, TaskStatus status, TaskPriority priority,
            Long assigneeId, Pageable pageable) {

        return taskRepository
            .findAllFiltered(projectId, status, priority, assigneeId, pageable)
            .map(TaskResponse::from);
    }

    public TaskResponse findById(Long id) {
        return TaskResponse.from(getTask(id));
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest request) {
        Project project = projectRepository.findById(request.projectId())
            .orElseThrow(() -> ResourceNotFoundException.of("Project", request.projectId()));

        User assignee = null;
        if (request.assigneeId() != null) {
            assignee = userRepository.findById(request.assigneeId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", request.assigneeId()));
        }

        Task task = Task.builder()
            .title(request.title())
            .description(request.description())
            .priority(request.priority())
            .project(project)
            .assignee(assignee)
            .dueDate(request.dueDate())
            .build();

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = getTask(id);

        if (request.title()       != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.status()      != null) task.setStatus(request.status());
        if (request.priority()    != null) task.setPriority(request.priority());
        if (request.dueDate()     != null) task.setDueDate(request.dueDate());

        if (request.assigneeId() != null) {
            User assignee = userRepository.findById(request.assigneeId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", request.assigneeId()));
            task.setAssignee(assignee);
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateStatus(Long id, UpdateTaskStatusRequest request) {
        Task task = getTask(id);
        task.setStatus(request.status());
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void delete(Long id) {
        taskRepository.delete(getTask(id));
    }

    private Task getTask(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> ResourceNotFoundException.of("Task", id));
    }
}
