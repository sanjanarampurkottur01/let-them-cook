package com.letscook.menu.model.dish;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDish {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String image;
}
