package com.letscook.payment.controller;

import com.letscook.payment.model.PaymentRequestInput;
import com.letscook.payment.model.PaymentResponse;
import com.letscook.payment.service.PaymentService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @PostMapping
    public PaymentResponse completePayment(@RequestBody String payment) throws StripeException {
        PaymentResponse response = new PaymentResponse();
        response.setClientSecret(paymentService.chargeCustomer(payment));
        response.setPaymentId(1L);
        return response;

    }
    @ExceptionHandler
    public String handleError(StripeException ex) {
        return ex.getMessage();
    }
}