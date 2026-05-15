package com.federico.taskforge.repository;

import com.federico.taskforge.domain.entity.Task;
import com.federico.taskforge.domain.enums.TaskPriority;
import com.federico.taskforge.domain.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    Page<Task> findByAssigneeId(Long assigneeId, Pageable pageable);

    @Query("""
        SELECT t FROM Task t
        WHERE (:projectId  IS NULL OR t.project.id   = :projectId)
          AND (:status     IS NULL OR t.status        = :status)
          AND (:priority   IS NULL OR t.priority      = :priority)
          AND (:assigneeId IS NULL OR t.assignee.id   = :assigneeId)
        """)
    Page<Task> findAllFiltered(
        @Param("projectId")  Long projectId,
        @Param("status")     TaskStatus status,
        @Param("priority")   TaskPriority priority,
        @Param("assigneeId") Long assigneeId,
        Pageable pageable
    );
}
