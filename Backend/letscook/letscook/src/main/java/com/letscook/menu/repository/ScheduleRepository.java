package com.letscook.menu.repository;

import com.letscook.menu.model.meal.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findAllByCook_Id(Long cookId);
}
