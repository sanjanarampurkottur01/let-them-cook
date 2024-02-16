package com.letscook.order.model;

import com.letscook.enums.OrderStatus;
import com.letscook.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderInput {
    private String type;
    private OrderStatus status;
    private Long customerId;
    private PaymentStatus paymentStatus;
    private List<MealorderInput> mealorderInputs;
}
