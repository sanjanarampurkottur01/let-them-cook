package com.letscook.menu.model.meal;

import com.letscook.cook.model.Cook;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private Date start_date;

    @ManyToOne
    @JoinColumn(name = "cook_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Cook cook;
}

