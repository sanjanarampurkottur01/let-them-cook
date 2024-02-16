package com.letscook.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = this.stripeApiKey;
    }
//    public String chargeCustomer(PaymentRequestInput paymentRequestInput) throws StripeException {
//        Map<String, Object> chargeParams = new HashMap<>();
//        chargeParams.put("amount", paymentRequestInput.getAmount());
//        chargeParams.put("currency", "CAD");
//        chargeParams.put("source", paymentRequestInput.getToken().getId());
//
//        Charge charge = Charge.create(chargeParams);
//        return charge.getId();
//    }

    public String chargeCustomer(String str) throws StripeException {
        Stripe.apiKey = "sk_test_51OFSQSGMYsdcyHsgSYT2SiJxnqjGA1D59BtpuC672FzTudagfrK9JeOWTECzxyyISPLSFRDL9hHfReSTy4ayfX7N00kkq9ieUl";
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(100L)
                        .setCurrency("usd")
                        .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        params.getAmount();
        return paymentIntent.getClientSecret();
    }
}
