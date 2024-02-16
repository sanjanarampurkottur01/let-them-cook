package com.letscook.customer.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCustomerProfileInput {
    private Long userId;
    private String name;
    private String phoneNumber;
}
