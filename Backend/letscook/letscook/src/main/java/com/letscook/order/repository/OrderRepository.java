package com.letscook.order.repository;

import com.letscook.enums.OrderStatus;
import com.letscook.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByCustomer_IdOrderByCreatedAtDesc(Long id);

//    List<Order> findAllByMeal_Menu_Cook_IdOrderByCreatedAtDesc(Long id);

    //    List<Order> findAllByMeal_Menu_IdOrderByCreatedAtDesc(Long id);
    List<Order> findAllByMealorders_Meal_IdOrderByCreatedAtAsc(Long id);

    List<Order> findAllByMealorders_Meal_Schedule_Cook_Id(Long id);

    List<Order> findAllByStatusAndAndCustomer_IdOrderByCreatedAtDesc(OrderStatus status, Long id);
}
