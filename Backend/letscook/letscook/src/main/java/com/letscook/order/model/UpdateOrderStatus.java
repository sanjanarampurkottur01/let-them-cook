package com.letscook.order.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatus {
    private Long orderId;
    private Long mealOrderId;
    private Long customerId;
    private String status;
}
