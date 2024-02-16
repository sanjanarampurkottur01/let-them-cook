package com.letscook.menu.model.input;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AddMealToScheduleInput {
    private String name;
    private Long maxOrderLimit;
    private String slot;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date orderDeadline;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date mealDate;
    private String image;
    private Double price;
    private Long scheduleId;
}
