package com.letscook.order.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.letscook.menu.model.meal.Meal;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mealorder")
public class Mealorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity", nullable = false)
    private Long quantity;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "amount", nullable = true)
    private Double amount;

    @ManyToOne
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JsonIgnore
    private Meal meal;
}
