package com.federico.taskforge.repository;

import com.federico.taskforge.domain.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** Return projects where the given user is the owner OR a member. */
    @Query("""
        SELECT DISTINCT p FROM Project p
        LEFT JOIN p.members m
        WHERE p.owner.id = :userId OR m.id = :userId
        """)
    Page<Project> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    /** Count tasks for a project with a specific status filter (used for completedTaskCount). */
    @Query("""
        SELECT COUNT(t) FROM Task t
        WHERE t.project.id = :projectId AND t.status = com.federico.taskforge.domain.enums.TaskStatus.DONE
        """)
    long countCompletedTasks(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    long countTasks(@Param("projectId") Long projectId);
}
