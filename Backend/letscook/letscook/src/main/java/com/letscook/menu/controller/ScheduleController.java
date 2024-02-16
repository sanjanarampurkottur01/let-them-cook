package com.letscook.menu.controller;

import com.letscook.menu.model.CreateDish;
import com.letscook.menu.model.DishToMealMap;
import com.letscook.menu.model.dish.AddDishToMealInput;
import com.letscook.menu.model.dish.Dish;
import com.letscook.menu.model.dish.UpdateDish;
import com.letscook.menu.model.input.*;
import com.letscook.menu.model.meal.Meal;
import com.letscook.menu.model.meal.Schedule;
import com.letscook.menu.service.ScheduleService;
import com.letscook.order.model.Mealorder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/menu")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/createSchedule")
    public ResponseEntity<Schedule> createSchedule(@RequestBody() CreateScheduleInput createScheduleInput) throws IOException {
        return scheduleService.createSchedule(createScheduleInput);
    }

    @GetMapping("/{id}")
    public Schedule getScheduleById(@PathVariable() Long id) {
        return scheduleService.getScheduleById(id);
    }

    @GetMapping("/cook")
    public List<Schedule> getSchedulesByCookId(@RequestParam Long cookId) {
        return scheduleService.getSchedulesByCook(cookId);
    }

    @PostMapping("/updateSchedule")
    public ResponseEntity<Schedule> updateSchedule(@RequestBody() UpdateScheduleInput updateScheduleInput) throws IOException {
        return scheduleService.updateSchedule(updateScheduleInput);
    }

    @DeleteMapping("/deleteSchedule/{id}")
    public Schedule deleteSchedule(@PathVariable() Long id) {
        return scheduleService.deleteScheduleById(id);
    }

    @PostMapping("/addMealToSchedule")
    public ResponseEntity<Meal> addMealToSchedule(@RequestBody() AddMealToScheduleInput addMealToScheduleInput) throws IOException {
        return scheduleService.addMealToSchedule(addMealToScheduleInput);
    }

    @PostMapping("/updateMealToSchedule")
    public ResponseEntity<Meal> updateMealToSchedule(@RequestBody() UpdateMealToScheduleInput updateMealToScheduleInput) throws IOException {
        return scheduleService.updateMealToSchedule(updateMealToScheduleInput);
    }

    @GetMapping("/meal/{id}")
    public Meal getMealById(@PathVariable() Long id) {
        return scheduleService.getMealById(id);
    }

    @GetMapping("/meal/cook/{id}")
    public List<Meal> getMealsByCookId(@PathVariable() Long id) {
        return scheduleService.getMealsByCookId(id);
    }

    @DeleteMapping("/deleteMeal/{id}")
    public Meal deleteMeal(@PathVariable() Long id) {
        return scheduleService.deleteMealById(id);
    }

//    @GetMapping("/menuImage/{id}")
//    public ResponseEntity<byte[]> getMenuImage(@PathVariable() Long id) throws IOException {
//        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(scheduleService.getMenuImage(id));
//    }

    @PostMapping("/createDish")
    public ResponseEntity<Dish> createDish(@RequestBody CreateDish createDish) throws IOException {
        return scheduleService.createDish(createDish);
    }

    @GetMapping("/dish/{id}")
    public Dish getDishById(@PathVariable() Long id) {
        return scheduleService.getDishById(id);
    }

//    @GetMapping("/dishImage/{id}")
//    public ResponseEntity<byte[]> getDishImage(@PathVariable() Long id) throws IOException {
//        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(scheduleService.getDishImage(id));
//    }

    @PostMapping("/updateDish")
    public ResponseEntity<Dish> updateDish(@RequestBody UpdateDish updateDish) throws IOException {
        return scheduleService.updateDish(updateDish);
    }

    @DeleteMapping("/deleteDish/{id}")
    public Dish deleteDish(@PathVariable() Long id) {
        return scheduleService.deleteDishById(id);
    }

//    @GetMapping("/meal/address")
//    public List<Meal> getMealsByCookAddress(@RequestParam() String address) {
//        return scheduleService.getMealsByCookAddress(address);
//    }

    @PostMapping("/meal/cookdaterange")
    public List<Meal> getMealsByCookDateRange(@RequestBody() CookDateRangeInput cookDateRangeInput) {
        return scheduleService.getMealsByCookDateRange(cookDateRangeInput);
    }

    @PostMapping("/addDishToMeal")
    public ResponseEntity<DishToMealMap> addDishToMeal(@RequestBody AddDishToMealInput addDishToMealInput) throws IOException {
        return scheduleService.addDishToMeal(addDishToMealInput);
    }

    @GetMapping("/getDishesByMeal/{id}")
    public List<Dish> getDishesByMeal(@PathVariable() Long id) {
        return scheduleService.getDishesByMealId(id);
    }

    @GetMapping("/getMealsBySchedule/{id}")
    public List<Meal> getMealsBySchedule(@PathVariable() Long id) {
        return scheduleService.getMealsByScheduleId(id);
    }

    @GetMapping("/getMealOrders/{id}")
    public List<Mealorder> getMealOrdersByMealId(@PathVariable() Long id) {
        return scheduleService.getMealOrdersByMealId(id);
    }
}
