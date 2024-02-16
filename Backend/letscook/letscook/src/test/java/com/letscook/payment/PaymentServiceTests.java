package com.letscook.payment;


import com.letscook.enums.PaymentStatus;
import com.letscook.order.model.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PaymentServiceTests {
    @Test
    public void testPaymentStatusEnum() throws IOException {
        Order order = new Order();
        order.setPaymentStatus(PaymentStatus.ACCEPTED);
        assertTrue(Arrays.stream(PaymentStatus.values()).anyMatch((t) -> t.name().equals(order.getPaymentStatus().toString())));
    }

}
