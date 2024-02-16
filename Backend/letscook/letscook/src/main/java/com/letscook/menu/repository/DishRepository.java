package com.letscook.menu.repository;

import com.letscook.menu.model.dish.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishRepository extends JpaRepository<Dish, Long> {
}
