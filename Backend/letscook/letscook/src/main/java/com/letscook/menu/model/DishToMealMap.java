package com.letscook.menu.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "dishtomealmap")
public class DishToMealMap {

    @EmbeddedId
    private DishToMealId id;

}
