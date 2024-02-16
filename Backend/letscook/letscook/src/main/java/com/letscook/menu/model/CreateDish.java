package com.letscook.menu.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDish {
    private String name;
    private String description;
    private String type;
    private String image;
    private Long cookId;
}
