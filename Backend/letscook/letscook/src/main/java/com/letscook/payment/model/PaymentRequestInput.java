package com.letscook.payment.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestInput {
    private Long amount;
    private Token token;
}
