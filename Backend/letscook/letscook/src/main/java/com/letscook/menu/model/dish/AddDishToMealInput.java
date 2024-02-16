package com.letscook.menu.model.dish;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddDishToMealInput {
    private Long meal_id;
    private Long dish_id;
}
