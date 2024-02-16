package com.letscook.order.repository;

import com.letscook.order.model.Mealorder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealorderRepository extends JpaRepository<Mealorder, Long> {
}
