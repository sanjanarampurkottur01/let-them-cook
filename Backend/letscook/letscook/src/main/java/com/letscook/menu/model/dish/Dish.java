package com.letscook.menu.model.dish;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.letscook.cook.model.Cook;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "dish")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "image", nullable = true)
    private String image;

    @Column(name = "description", nullable = true)
    private String description;

    @Column(name = "type", nullable = true)
    private String type;

    @ManyToOne
    @JsonIgnore
    private Cook cook;
}
