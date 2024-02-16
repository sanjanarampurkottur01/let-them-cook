package com.letscook.menu.repository;

import com.letscook.menu.model.meal.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findMealsBySchedule_Cook_IdOrderByMealDateAsc(Long id);

//    List<Meal> findMealsBySchedule_Cook_Address(String address);

    List<Meal> findAllByMealDateBetweenAndSchedule_Cook_Id(
            Date mealDateStart,
            Date mealDateEnd, Long id);

    List<Meal> findMealsBySchedule_Id(Long id);

    List<Meal> findAllByIdIn(List<Long> id);
}
