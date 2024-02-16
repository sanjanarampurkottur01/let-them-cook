package com.letscook.payment.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentResponse {
    String clientSecret;
    Long paymentId;
}
