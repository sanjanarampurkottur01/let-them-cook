package com.letscook.customer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;
}
