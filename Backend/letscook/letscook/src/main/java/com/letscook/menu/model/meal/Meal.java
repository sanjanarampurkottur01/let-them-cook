package com.letscook.menu.model.meal;

import com.letscook.order.model.Mealorder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "meals")
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "max_order_limit", nullable = false)
    private Long maxOrderLimit;

    @Column(name = "slot", nullable = false)
    private String slot;

    @Column(name = "order_deadline", nullable = false)
    private Date orderDeadline;

    @Column(name = "current_order_count", nullable = true)
    private Long currentOrderCount;

    @Column(name = "meal_date", nullable = false)
    private Date mealDate;

    @Column(name = "image", nullable = true)
    private String image;

    @Column(name = "price", nullable = false)
    private Double price;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Schedule schedule;

    @OneToMany(mappedBy = "meal")
    private List<Mealorder> mealorders;
}