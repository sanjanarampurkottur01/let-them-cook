package com.letscook.order.model;

import com.letscook.customer.model.Customer;
import com.letscook.enums.OrderStatus;
import com.letscook.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type", nullable = true)
    private String type;

    @Column(name = "status", nullable = true)
    private OrderStatus status;

//    @ManyToOne
//    @JoinColumn(name = "meal_id", nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    private Meal meal;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Customer customer;

    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "amount", nullable = true)
    private Double amount;

    @OneToMany(mappedBy = "order")
    private List<Mealorder> mealorders;


}
