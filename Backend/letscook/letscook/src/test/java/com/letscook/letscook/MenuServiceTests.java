package com.letscook.letscook;

import com.letscook.cook.model.Cook;
import com.letscook.cook.repository.CookRepository;
import com.letscook.menu.model.CreateDish;
import com.letscook.menu.model.DishToMealId;
import com.letscook.menu.model.DishToMealMap;
import com.letscook.menu.model.dish.AddDishToMealInput;
import com.letscook.menu.model.dish.Dish;
import com.letscook.menu.model.dish.UpdateDish;
import com.letscook.menu.model.input.*;
import com.letscook.menu.model.meal.Meal;
import com.letscook.menu.model.meal.Schedule;
import com.letscook.menu.repository.DishRepository;
import com.letscook.menu.repository.DishToMealRepository;
import com.letscook.menu.repository.MealRepository;
import com.letscook.menu.repository.ScheduleRepository;
import com.letscook.menu.service.ScheduleService;
import com.letscook.order.model.Mealorder;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class MenuServiceTests {
    @Mock
    private MealRepository mealRepository;
    @Mock
    private DishRepository dishRepository;
    @Mock
    private DishToMealRepository dishToMealRepository;
    @Mock
    private CookRepository cookRepository;
    @Mock
    private ScheduleRepository scheduleRepository;
    @InjectMocks
    private ScheduleService scheduleService;

    private Schedule schedule;
    private Cook cook;
    private Meal meal;
    private Dish dish;

    private static final long COOK_ID = 1L;
    private static final long SCHEDULE_ID = 1L;
    private static final long ORDER_ID = 1L;
    private static final long MAX_ORDER_LIMIT = 100L;
    private static final Double MEAL_PRICE = 100.00;
    private static final int YEAR = 2023;
    private static final int MONTH = Calendar.DECEMBER;
    private static final int DAY = Calendar.DAY_OF_MONTH;
    private static Date DATE;

    @BeforeAll
    public void init() {
        LocalDate localDate = LocalDate.of(YEAR, MONTH, DAY);
        DATE = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        buildCookAndScheduleData();
        buildMealData();
        buildDishData();
    }

    @Test
    public void createScheduleTest() {
        // Arrange
        CreateScheduleInput createScheduleInput = new CreateScheduleInput();
        createScheduleInput.setName("Week 1");
        createScheduleInput.setStart_date(DATE);
        createScheduleInput.setCookId(COOK_ID);

        when(cookRepository.findById(COOK_ID)).thenReturn(Optional.of(cook));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation ->
                invocation.getArgument(0));

        // Act
        ResponseEntity<Schedule> response = scheduleService.createSchedule(createScheduleInput);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Week 1", response.getBody().getName());
    }

    @Test
    public void getScheduleTest() {
        // Arrange
        when(scheduleRepository.findById(SCHEDULE_ID)).thenReturn(Optional.of(schedule));
        // Act
        Schedule scheduleResponse = scheduleService.getScheduleById(SCHEDULE_ID);
        // Assert
        assertEquals(scheduleResponse.getId(), SCHEDULE_ID);
    }

    @Test
    public void deleteScheduleTest() {
        // Arrange
        when(scheduleRepository.findById(SCHEDULE_ID)).thenReturn(Optional.of(schedule));
        doNothing().when(scheduleRepository).deleteById(SCHEDULE_ID);
        // Act
        Schedule scheduleResponse = scheduleService.deleteScheduleById(SCHEDULE_ID);
        // Assert
        assertEquals(scheduleResponse.getId(), SCHEDULE_ID);
    }

    @Test
    public void getSchedulesByCookTest() {
        // Arrange
        List<Schedule> scheduleList = new ArrayList<>();
        scheduleList.add(schedule);
        when(scheduleRepository.findAllByCook_Id(COOK_ID)).thenReturn(scheduleList);

        // Act
        List<Schedule> scheduleResponse = scheduleService.getSchedulesByCook(COOK_ID);
        // Assert
        assertEquals(scheduleResponse.get(0).getCook().getId(), COOK_ID);
    }

    @Test
    public void updateScheduleTest() {
        // Arrange
        UpdateScheduleInput updateScheduleInput = new UpdateScheduleInput();
        updateScheduleInput.setId(SCHEDULE_ID);
        updateScheduleInput.setName("Week 1");
        updateScheduleInput.setStart_date(DATE);

        when(scheduleRepository.findById(SCHEDULE_ID)).thenReturn(Optional.of(schedule));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation ->
                invocation.getArgument(0));

        // Act
        ResponseEntity<Schedule> response = scheduleService.updateSchedule(updateScheduleInput);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Week 1", response.getBody().getName());
    }

    @Test
    public void addMealToScheduleTests(){
        // Arrange
        AddMealToScheduleInput addMealToScheduleInput = getAddMealToScheduleInput();

        when(scheduleRepository.findById(SCHEDULE_ID)).thenReturn(Optional.of(schedule));
        when(mealRepository.save(any(Meal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<Meal> response = scheduleService.addMealToSchedule(addMealToScheduleInput);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Pav Bhaji", response.getBody().getName());
    }

    @Test
    public void getMealByIdTest() {
        // Arrange
        when(mealRepository.findById(ORDER_ID)).thenReturn(Optional.of(meal));
        // Act
        Meal mealResponse = scheduleService.getMealById(ORDER_ID);
        // Assert
        assertEquals(mealResponse.getId(), ORDER_ID);
    }

    @Test
    public void updateMealToScheduleTest() {
        // Arrange
        UpdateMealToScheduleInput updateMealToScheduleInput = getUpdateMealToScheduleInput();

        when(mealRepository.findById(ORDER_ID)).thenReturn(Optional.of(meal));
        when(scheduleRepository.findById(SCHEDULE_ID)).thenReturn(Optional.of(schedule));
        when(mealRepository.save(any(Meal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<Meal> response = scheduleService.updateMealToSchedule(updateMealToScheduleInput);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Pav Bhaji", response.getBody().getName());
    }

    @Test
    public void deleteMealByIdTest() {
        // Arrange
        when(mealRepository.findById(ORDER_ID)).thenReturn(Optional.of(meal));
        doNothing().when(mealRepository).deleteById(ORDER_ID);
        // Act
        Meal mealResponse = scheduleService.deleteMealById(ORDER_ID);
        // Assert
        assertEquals(mealResponse.getId(), ORDER_ID);
    }

    @Test
    public void getMealsByCookIdTest() {
        // Arrange
        List<Meal> mealList = new ArrayList<>();
        mealList.add(meal);
        when(mealRepository.findMealsBySchedule_Cook_IdOrderByMealDateAsc(COOK_ID)).thenReturn(mealList);

        // Act
        List<Meal> mealResponse = scheduleService.getMealsByCookId(COOK_ID);
        // Assert
        assertEquals(mealResponse.get(0).getSchedule().getCook().getId(), COOK_ID);
    }

    @Test
    public void getMealsByScheduleIdTest() {
        // Arrange
        List<Meal> mealList = new ArrayList<>();
        mealList.add(meal);
        when(mealRepository.findMealsBySchedule_Id(SCHEDULE_ID)).thenReturn(mealList);

        // Act
        List<Meal> mealResponse = scheduleService.getMealsByScheduleId(SCHEDULE_ID);
        // Assert
        assertEquals(mealResponse.get(0).getSchedule().getCook().getId(), SCHEDULE_ID);
    }

    @Test
    public void createDishTest() {
        // Arrange
        CreateDish createDish = new CreateDish();
        createDish.setName("Bhaji");
        createDish.setType("Veg");
        createDish.setDescription("Bhaji of Pav Bhaji");
        createDish.setImage("dish image url");
        createDish.setCookId(COOK_ID);

        when(cookRepository.findById(COOK_ID)).thenReturn(Optional.of(cook));
        when(dishRepository.save(any(Dish.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<Dish> response = scheduleService.createDish(createDish);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Bhaji", response.getBody().getName());
    }

    @Test
    public void getDishByIdTest() {
        // Arrange
        when(dishRepository.findById(ORDER_ID)).thenReturn(Optional.of(dish));
        // Act
        Dish dish = scheduleService.getDishById(ORDER_ID);
        // Assert
        assertEquals(dish.getId(), ORDER_ID);
    }

    @Test
    public void updateDishTest() {
        // Arrange
        UpdateDish updateDish = new UpdateDish();
        updateDish.setId(ORDER_ID);
        updateDish.setName("Bhaji");
        updateDish.setType("Veg");
        updateDish.setDescription("Bhaji of Pav Bhaji");
        updateDish.setImage("dish image url");

        when(dishRepository.findById(ORDER_ID)).thenReturn(Optional.of(dish));
        when(dishRepository.save(any(Dish.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<Dish> response = scheduleService.updateDish(updateDish);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Bhaji", response.getBody().getName());
    }

    @Test
    public void deleteDishByIdTest() {
        // Arrange
        when(dishRepository.findById(ORDER_ID)).thenReturn(Optional.of(dish));
        doNothing().when(dishRepository).deleteById(ORDER_ID);
        // Act
        Dish dishResponse = scheduleService.deleteDishById(ORDER_ID);
        // Assert
        assertEquals(dishResponse.getId(), ORDER_ID);
    }

    @Test
    public void getMealsByCookDateRangeTest() {
        // Arrange
        CookDateRangeInput cookDateRangeInput = new CookDateRangeInput();
        cookDateRangeInput.setStartDate(DATE);
        cookDateRangeInput.setEndDate(DATE);
        cookDateRangeInput.setId(COOK_ID);
        List<Meal> mealList = new ArrayList<>();
        mealList.add(meal);
        when(mealRepository.findAllByMealDateBetweenAndSchedule_Cook_Id(any(), any(),
                any())).thenReturn(mealList);
        // Act
        List<Meal> mealResponse = scheduleService.getMealsByCookDateRange(cookDateRangeInput);
        // Assert
        assertEquals(mealResponse.get(0).getId(), COOK_ID);
    }

    @Test
    public void addDishToMealTest() {
        // Arrange
        AddDishToMealInput addDishToMealInput = new AddDishToMealInput();
        addDishToMealInput.setDish_id(ORDER_ID);
        addDishToMealInput.setMeal_id(ORDER_ID);

        when(mealRepository.findById(ORDER_ID)).thenReturn(Optional.of(meal));
        when(dishRepository.findById(ORDER_ID)).thenReturn(Optional.of(dish));
        when(dishToMealRepository.save(any(DishToMealMap.class))).thenAnswer(invocation ->
                invocation.getArgument(0));

        // Act
        ResponseEntity<DishToMealMap> response = scheduleService.addDishToMeal(addDishToMealInput);
        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    public void getDishesByMealIdTest() {
        // Arrange

        DishToMealMap dishToMealMap = new DishToMealMap();
        DishToMealId id = new DishToMealId();
        id.setDishId(ORDER_ID);
        id.setMealId(ORDER_ID);
        dishToMealMap.setId(id);

        when(dishToMealRepository.findByIdMealId(ORDER_ID)).thenReturn(List.of(dishToMealMap));
        when(dishRepository.findById(ORDER_ID)).thenReturn(Optional.of(dish));

        // Act
        List<Dish> dishList = scheduleService.getDishesByMealId(ORDER_ID);
        // Assert
        assertEquals(dishList.get(0).getId(), dish.getId());
    }

    @Test
    public void getMealOrdersByMealIdTest() {
        // Arrange
        List<Mealorder> mealorderList = new ArrayList<>();
        Mealorder mealorder = new Mealorder();
        mealorder.setId(ORDER_ID);
        mealorderList.add(mealorder);
        meal.setMealorders(mealorderList);

        when(mealRepository.findById(ORDER_ID)).thenReturn(Optional.of(meal));

        // Act
        List<Mealorder> mealOrders = scheduleService.getMealOrdersByMealId(ORDER_ID);
        // Assert
        assertEquals(mealOrders.size(), mealorderList.size());
    }

    @Test
    public void testMealOrder() throws IOException {
        // Arrange
        Mealorder mealorder = new Mealorder();
        mealorder.setId(ORDER_ID);
        mealorder.setQuantity(ORDER_ID);
        mealorder.setStatus("PENDING");
        mealorder.setAmount(MEAL_PRICE);
        mealorder.setMeal(meal);
        // Assert
        assertTrue(!Objects.isNull(mealorder));
        assertTrue(mealorder.getId() == ORDER_ID);
        assertTrue(!Objects.isNull(mealorder.getQuantity()));
        assertTrue(!Objects.isNull(mealorder.getStatus()));
        assertTrue(!Objects.isNull(mealorder.getAmount()));
        assertTrue(!Objects.isNull(mealorder.getMeal()));
    }

    @Test
    public void testDish() throws IOException {
        // Arrange
        Dish newDish = new Dish();
        Long id = ORDER_ID;
        String img = "dishUrl";
        String name = "chole";
        String description = "Chole Tiffin";
        String type = "Veg";
        newDish.setId(id);
        newDish.setName(name);
        newDish.setImage(img);
        newDish.setDescription(description);
        newDish.setType(type);
        newDish.setCook(cook);
        // Assert
        assertEquals(newDish.getId(), id);
        assertEquals(newDish.getImage(), img);
        assertEquals(newDish.getName(), name);
        assertEquals(newDish.getDescription(), description);
        assertEquals(newDish.getType(), type);
        assertEquals(newDish.getCook().getId(), cook.getId());
    }

    private static UpdateMealToScheduleInput getUpdateMealToScheduleInput() {
        UpdateMealToScheduleInput updateMealToScheduleInput = new UpdateMealToScheduleInput();
        updateMealToScheduleInput.setId(SCHEDULE_ID);
        updateMealToScheduleInput.setName("Pav Bhaji");
        updateMealToScheduleInput.setMealDate(DATE);
        updateMealToScheduleInput.setSlot("lunch");
        updateMealToScheduleInput.setMaxOrderLimit(MAX_ORDER_LIMIT);
        updateMealToScheduleInput.setOrderDeadline(DATE);
        updateMealToScheduleInput.setImage("meal url");
        updateMealToScheduleInput.setPrice(MEAL_PRICE);
        updateMealToScheduleInput.setScheduleId(SCHEDULE_ID);
        return updateMealToScheduleInput;
    }

    private void buildDishData() {
        dish = new Dish();
        dish.setId(ORDER_ID);
        dish.setName("Bhaji");
        dish.setType("Veg");
        dish.setDescription("Bhaji of Pav Bhaji");
        dish.setImage("dish image url");
        dish.setCook(cook);
    }

    private void buildMealData() {
        meal = new Meal();
        meal.setId(ORDER_ID);
        meal.setName("Pav Bhaji");
        meal.setMealDate(DATE);
        meal.setSlot("lunch");
        meal.setMaxOrderLimit(MAX_ORDER_LIMIT);
        meal.setOrderDeadline(DATE);
        meal.setImage("meal url");
        meal.setPrice(MEAL_PRICE);
        meal.setSchedule(schedule);
    }

    private void buildCookAndScheduleData() {
        cook = new Cook();
        cook.setId(COOK_ID);
        schedule = new Schedule();
        schedule.setId(SCHEDULE_ID);
        schedule.setName("Week 1");
        schedule.setStart_date(DATE);
        schedule.setCook(cook);
    }

    private static AddMealToScheduleInput getAddMealToScheduleInput() {
        AddMealToScheduleInput addMealToScheduleInput = new AddMealToScheduleInput();
        addMealToScheduleInput.setName("Pav Bhaji");
        addMealToScheduleInput.setMealDate(DATE);
        addMealToScheduleInput.setSlot("lunch");
        addMealToScheduleInput.setMaxOrderLimit(MAX_ORDER_LIMIT);
        addMealToScheduleInput.setOrderDeadline(DATE);
        addMealToScheduleInput.setImage("meal url");
        addMealToScheduleInput.setPrice(MEAL_PRICE);
        addMealToScheduleInput.setScheduleId(SCHEDULE_ID);
        return addMealToScheduleInput;
    }



}
