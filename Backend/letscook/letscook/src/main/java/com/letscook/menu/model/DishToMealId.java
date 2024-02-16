package com.letscook.menu.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Embeddable
public class DishToMealId implements Serializable {

    private Long mealId;
    private Long dishId;

}
