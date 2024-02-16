package com.letscook.order.service;

import com.letscook.cook.model.Cook;
import com.letscook.customer.model.Customer;
import com.letscook.customer.repository.CustomerRepository;
import com.letscook.enums.OrderStatus;
import com.letscook.menu.model.meal.Meal;
import com.letscook.menu.model.meal.Schedule;
import com.letscook.menu.repository.MealRepository;
import com.letscook.order.model.*;
import com.letscook.order.repository.MealorderRepository;
import com.letscook.order.repository.OrderRepository;
import com.letscook.userdetails.model.UserInfo;
import com.letscook.userdetails.repository.UserDetailsRepository;
import com.letscook.util.EmailSenderService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class OrderServiceTests {

    private static final long COOK_ID = 1L;
    private static final long SCHEDULE_ID = 1L;
    private static final long MEAL_ID = 2L;
    private static final long CUSTOMER_ID = 1L;
    private static final long PAST_MEAL_ID = 3L;
    private static final long ORDER_ID = 1L;
    private static final long LIMITED_MEAL_ID = 4L;
    private static final int DAYS_TO_BE_ADDED = 10;
    private static final long MAX_ORDER_LIMIT = 100L;
    private static final Double MEAL_PRICE = 100.00;
    private static final long LIMITED_MEAL_MAX_ORDER_LIMIT = 1L;
    private static final int DAYS_TO_BE_SUBTRACTED = -10;
    private static final int MEAL_QTY = 2;
    private static final int YEAR = 2023;
    private static final int MONTH = Calendar.DECEMBER;
    private static final int DAY = Calendar.DAY_OF_MONTH;
    private static Date DATE;

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private MealRepository mealRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private MealorderRepository mealorderRepository;
    @Mock
    private UserDetailsRepository userDetailsRepository;

    @Mock
    private EmailSenderService emailSenderService;

    @InjectMocks
    private OrderService orderService;
    private Schedule schedule;
    private Cook cook;
    private Meal meal;
    private Meal pastMeal;
    private Meal limitedMeal;
    private Customer customer;
    private Order order;

    private UserInfo userinfo;

    @BeforeAll
    public void init() {
        LocalDate localDate = LocalDate.of(YEAR, MONTH, DAY);
        DATE = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        buildCookModel();
        buildScheduleModel();
        Date currentDate = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(currentDate);
        cal.add(Calendar.DATE, DAYS_TO_BE_ADDED);
        Date mealDate = cal.getTime();
        buildMealModel(mealDate);
        buildPastMeal(currentDate);
        buildLimitedMeal(mealDate);
        buildCustomer();
        buildOrder();
        userinfo = new UserInfo();
        userinfo.setId(1L);
        userinfo.setEmail("test@gmail.com");
    }

    @Test
    public void testCreateOrder() {
        // Arrange
        CreateOrderInput createOrderInput = new CreateOrderInput();
        createOrderInput.setType("Subscription");
        createOrderInput.setStatus(OrderStatus.PENDING);
        createOrderInput.setCustomerId(CUSTOMER_ID);

        MealorderInput input = new MealorderInput();
        input.setMealId(MEAL_ID);
        input.setQuantity(MEAL_ID);
        List<MealorderInput> mealOrderInputs = List.of(input);
        createOrderInput.setMealorderInputs(mealOrderInputs);

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(
                Optional.of(new Customer()));
        when(mealRepository.findAllByIdIn(List.of(MEAL_ID))).
                thenReturn(Collections.singletonList(meal));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation ->
                invocation.getArgument(0));
        when(mealRepository.save(any(Meal.class))).thenAnswer(invocation ->
                invocation.getArgument(0));
        when(mealorderRepository.save(any(Mealorder.class))).thenAnswer(invocation ->
                invocation.getArgument(0));
        when(userDetailsRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(userinfo));
        doReturn(true).when(emailSenderService).sendSimpleEmail(anyString(), anyString(), anyString());

        // Act
        ResponseEntity<Order> response = orderService.createOrder(createOrderInput);

        assertEquals(Objects.requireNonNull(response.getBody()).getAmount(),
                meal.getPrice() * MEAL_QTY);
    }

    @Test
    public void testCreateOrder_OrderDeadlineReached() {
        // Arrange
        CreateOrderInput createOrderInput = new CreateOrderInput();
        createOrderInput.setType("Subscription");
        createOrderInput.setStatus(OrderStatus.PENDING);
        createOrderInput.setCustomerId(CUSTOMER_ID);

        MealorderInput input = new MealorderInput();
        input.setMealId(PAST_MEAL_ID);
        input.setQuantity(MEAL_ID);
        List<MealorderInput> mealOrderInputs = List.of(input);
        createOrderInput.setMealorderInputs(mealOrderInputs);

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(
                Optional.of(new Customer()));
        when(mealRepository.findAllByIdIn(List.of(PAST_MEAL_ID))).thenReturn(
                Collections.singletonList(pastMeal));

        // Act
        assertThrows(RuntimeException.class, () -> orderService.
                createOrder(createOrderInput));
        verify(mealRepository, never()).save(any(Meal.class));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    public void testCreateOrder_OrderLimitReached() {
        // Arrange
        CreateOrderInput createOrderInput = new CreateOrderInput();
        createOrderInput.setType("Subscription");
        createOrderInput.setStatus(OrderStatus.PENDING);
        createOrderInput.setCustomerId(CUSTOMER_ID);

        MealorderInput input = new MealorderInput();
        input.setMealId(LIMITED_MEAL_ID);
        input.setQuantity(MEAL_ID);
        List<MealorderInput> mealOrderInputs = List.of(input);
        createOrderInput.setMealorderInputs(mealOrderInputs);

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(
                Optional.of(new Customer()));
        when(mealRepository.findAllByIdIn(List.of(LIMITED_MEAL_ID))).thenReturn(
                Collections.singletonList(limitedMeal));

        // Act
        assertThrows(RuntimeException.class, () ->
                orderService.createOrder(createOrderInput));
        verify(mealRepository, never()).save(any(Meal.class));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    public void testCreateOrderMealNotFound() {
        // Arrange
        CreateOrderInput createOrderInput = new CreateOrderInput();
        createOrderInput.setType("Subscription");
        createOrderInput.setStatus(OrderStatus.PENDING);
        createOrderInput.setCustomerId(CUSTOMER_ID);

        MealorderInput input = new MealorderInput();
        input.setMealId(MEAL_ID);
        input.setQuantity(MEAL_ID);
        List<MealorderInput> mealOrderInputs = List.of(input);
        createOrderInput.setMealorderInputs(mealOrderInputs);

        when(customerRepository.findById(CUSTOMER_ID)).thenReturn(
                Optional.of(new Customer()));
        when(mealRepository.findAllByIdIn(List.of(MEAL_ID))).thenReturn(
                new ArrayList<>());

        // Act
        assertThrows(EntityNotFoundException.class, () ->
                orderService.createOrder(createOrderInput));
        verify(mealRepository, never()).save(any(Meal.class));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    public void testGetOrderById() {
        // Arrange
        when(orderRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(order));
        Order getOrder = orderService.getOrderById(CUSTOMER_ID);

        // Act
        assertEquals(CUSTOMER_ID, getOrder.getId());
    }

    @Test
    public void testGetOrdersByCustomer() {
        // Arrange
        List<Order> orderList = new ArrayList<>();
        orderList.add(order);
        when(orderRepository.findAllByCustomer_IdOrderByCreatedAtDesc(ORDER_ID)).
                thenReturn(orderList);
        List<Order> custOrderList = orderService.getOrdersByCustomer(CUSTOMER_ID);

        // Act
        assertEquals(custOrderList.size(), orderList.size());
    }

    @Test
    public void testGetOrdersByMeal() {
        // Arrange
        List<Order> orderList = new ArrayList<>();
        Mealorder mealorder = new Mealorder();
        mealorder.setMeal(meal);
        order.setMealorders(Arrays.asList(mealorder));
        orderList.add(order);

        when(orderRepository.findAllByMealorders_Meal_IdOrderByCreatedAtAsc(ORDER_ID)).thenReturn(orderList);
        List<Order> custOrderList = orderService.getOrdersByMeal(ORDER_ID);

        // Act
        assertEquals(custOrderList.size(), orderList.size());
    }

    @Test
    public void testUpdateOrderStatus() {
        // Arrange
        Long mealOrderId = ORDER_ID;
        Long orderId = ORDER_ID;
        Long customerId = customer.getId();
        UpdateOrderStatus updateOrderStatus = new UpdateOrderStatus();
        updateOrderStatus.setMealOrderId(mealOrderId);
        updateOrderStatus.setOrderId(orderId);
        updateOrderStatus.setStatus(OrderStatus.COOKING_STARTED.name());
        updateOrderStatus.setCustomerId(customerId);
        Mealorder mealorder = new Mealorder();
        mealorder.setMeal(meal);
        mealorder.setId(mealOrderId);
        mealorder.setStatus(OrderStatus.PENDING.name());


        when(mealorderRepository.findById(mealOrderId)).thenReturn(Optional.of(mealorder));
        when(userDetailsRepository.findById(customerId)).thenReturn(Optional.of(userinfo));
        doReturn(true).when(emailSenderService).sendSimpleEmail(anyString(), anyString(), anyString());

        when(mealorderRepository.save(any(Mealorder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Mealorder updatedOrder = orderService.updateOrderStatus(updateOrderStatus).getBody();

        // Act
        assert updatedOrder != null;
        assertEquals(updatedOrder.getStatus(), updateOrderStatus.getStatus());
        assertEquals(updateOrderStatus.getOrderId(), orderId);
        assertEquals(updateOrderStatus.getMealOrderId(), mealOrderId);
        assertEquals(updateOrderStatus.getCustomerId(), customerId);
    }

    private void buildOrder() {
        order = new Order();
        order.setId(ORDER_ID);
    }

    private void buildCustomer() {
        customer = new Customer();
        customer.setId(CUSTOMER_ID);
        customer.setName("Adam");
        customer.setPhoneNumber("474755959");
    }

    private void buildLimitedMeal(Date mealDate) {
        limitedMeal = new Meal();
        limitedMeal.setId(LIMITED_MEAL_ID);
        limitedMeal.setName("Rajma");
        limitedMeal.setMealDate(mealDate);
        limitedMeal.setSlot("lunch");
        limitedMeal.setMaxOrderLimit(LIMITED_MEAL_MAX_ORDER_LIMIT);
        limitedMeal.setOrderDeadline(mealDate);
        limitedMeal.setImage("pavbhajiurl");
        limitedMeal.setPrice(OrderServiceTests.MEAL_PRICE);
        limitedMeal.setSchedule(schedule);
    }

    private void buildPastMeal(Date currentDate) {
        pastMeal = new Meal();
        pastMeal.setId(PAST_MEAL_ID);
        pastMeal.setName("Chole");
        Calendar pastCalendar = Calendar.getInstance();
        pastCalendar.setTime(currentDate);
        pastCalendar.add(Calendar.DATE, DAYS_TO_BE_SUBTRACTED);
        Date pastDate = pastCalendar.getTime();
        pastMeal.setMealDate(pastDate);
        pastMeal.setSlot("lunch");
        pastMeal.setMaxOrderLimit(OrderServiceTests.MAX_ORDER_LIMIT);
        pastMeal.setOrderDeadline(pastDate);
        pastMeal.setImage("pavbhajiurl");
        pastMeal.setPrice(OrderServiceTests.MEAL_PRICE);
        pastMeal.setSchedule(schedule);
    }

    private void buildMealModel(Date mealDate) {
        meal = new Meal();
        meal.setId(MEAL_ID);
        meal.setName("Pav Bhaji");
        meal.setMealDate(mealDate);
        meal.setSlot("lunch");
        meal.setMaxOrderLimit(OrderServiceTests.MAX_ORDER_LIMIT);
        meal.setOrderDeadline(mealDate);
        meal.setImage("pavbhajiurl");
        meal.setPrice(OrderServiceTests.MEAL_PRICE);
        meal.setSchedule(schedule);
    }

    private void buildScheduleModel() {
        schedule = new Schedule();
        schedule.setId(SCHEDULE_ID);
        schedule.setName("Week 1");
        schedule.setStart_date(DATE);
        schedule.setCook(cook);
    }

    private void buildCookModel() {
        cook = new Cook();
        cook.setId(COOK_ID);
    }
}