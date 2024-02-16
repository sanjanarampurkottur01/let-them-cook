package com.letscook.menu.repository;

import com.letscook.menu.model.DishToMealId;
import com.letscook.menu.model.DishToMealMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishToMealRepository extends JpaRepository<DishToMealMap, DishToMealId> {

    List<DishToMealMap> findByIdMealId(Long mealId);
}
