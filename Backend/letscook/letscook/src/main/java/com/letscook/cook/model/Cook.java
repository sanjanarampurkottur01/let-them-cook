package com.letscook.cook.model;

import com.letscook.menu.model.dish.Dish;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "cooks")
public class Cook {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "business_name", nullable = true)
    private String businessName;

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "address", nullable = true)
    private String address;

    @Column(name = "profile_photo", nullable = true)
    private String profilePhoto;

    @Column(name = "banner_image", nullable = true)
    private String bannerImage;

    @Column(name = "business_document", nullable = true)
    private String businessDocument;

    @OneToMany(mappedBy = "cook")
    private List<Dish> dishes;

}
