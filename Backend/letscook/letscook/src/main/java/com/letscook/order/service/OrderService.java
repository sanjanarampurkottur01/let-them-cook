package com.letscook.order.service;

import com.letscook.customer.repository.CustomerRepository;
import com.letscook.enums.OrderStatus;
import com.letscook.menu.model.meal.Meal;
import com.letscook.menu.repository.MealRepository;
import com.letscook.order.model.*;
import com.letscook.order.repository.MealorderRepository;
import com.letscook.order.repository.OrderRepository;
import com.letscook.userdetails.repository.UserDetailsRepository;
import com.letscook.util.EmailSenderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MealorderRepository mealorderRepository;

    @Autowired
    private EmailSenderService senderService;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    public ResponseEntity<Order> createOrder(CreateOrderInput createOrderInput)
            throws EntityNotFoundException {
        Order orderToCreate = createOrderModel(createOrderInput);
        List<Long> mealIds = new ArrayList<>();
        for (MealorderInput mealorderInput : createOrderInput.getMealorderInputs()) {
            mealIds.add(mealorderInput.getMealId());
        }
        List<Meal> meals = mealRepository.findAllByIdIn(mealIds);
        if (mealIds.size() > meals.size()) {
            throw new EntityNotFoundException("Didn't find all meals in db");
        }
        HashMap<Long, Meal> mealMap = new HashMap<>();
        for (Meal meal : meals) {
            mealMap.put(meal.getId(), meal);
        }
        double amount = 0;
        amount = computeOrderToCreateAmount(createOrderInput, mealMap, amount);
        orderToCreate.setAmount(amount);
        Order orderCreated = orderRepository.save(orderToCreate);
        createMealOrder(createOrderInput, mealMap, orderCreated);
        String email = userDetailsRepository.findById(createOrderInput.getCustomerId()).get().getEmail();
        senderService.sendSimpleEmail(email, "Order Created",
                "You order has been placed with order id" + orderCreated.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(orderCreated);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    private static double computeOrderToCreateAmount(CreateOrderInput createOrderInput,
                                                     HashMap<Long, Meal> mealMap, double amount) {
        for (MealorderInput mealorderInput : createOrderInput.getMealorderInputs()) {
            Meal meal = mealMap.get(mealorderInput.getMealId());
            Long currentOrderCount = Objects.requireNonNullElse(meal.getCurrentOrderCount(), 0L);
            if ((currentOrderCount + mealorderInput.getQuantity()) > meal.getMaxOrderLimit()) {
                throw new RuntimeException("Max order limit has been reached");
            } else if (new Date().after(meal.getOrderDeadline())) {
                throw new RuntimeException("Cannot order after deadline");
            }
            amount += meal.getPrice() * mealorderInput.getQuantity();
        }
        return amount;
    }

    private void createMealOrder(CreateOrderInput createOrderInput, HashMap<Long, Meal> mealMap,
                                 Order orderCreated) {
        for (MealorderInput mealorderInput : createOrderInput.getMealorderInputs()) {
            Meal meal = mealMap.get(mealorderInput.getMealId());
            Long currentOrderCount = Objects.requireNonNullElse(meal.getCurrentOrderCount(), 0L);
            meal.setCurrentOrderCount(currentOrderCount + mealorderInput.getQuantity());
            mealRepository.save(meal);
            Mealorder mealorder = new Mealorder();
            mealorder.setMeal(meal);
            mealorder.setOrder(orderCreated);
            mealorder.setQuantity(mealorderInput.getQuantity());
            mealorder.setStatus(OrderStatus.PENDING.name());
            mealorder.setAmount(meal.getPrice() * mealorderInput.getQuantity());
            mealorderRepository.save(mealorder);
        }
    }

    private Order createOrderModel(CreateOrderInput createOrderInput) throws EntityNotFoundException {
        Order orderToCreate = new Order();
        orderToCreate.setType(createOrderInput.getType());
        orderToCreate.setStatus(createOrderInput.getStatus());
        orderToCreate.setCustomer(
                customerRepository.findById(createOrderInput.getCustomerId()).orElse(null));
        orderToCreate.setPaymentStatus(createOrderInput.getPaymentStatus());
        if (orderToCreate.getCustomer() == null) {
            throw new EntityNotFoundException("Customer not found for: " + createOrderInput.getCustomerId());
        }
        return orderToCreate;
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findAllByCustomer_IdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getOrdersByMeal(Long mealId) {
        List<Order> orderList = orderRepository.findAllByMealorders_Meal_IdOrderByCreatedAtAsc(mealId);
        for (Order order : orderList) {
            List<Mealorder> mealOrders = new ArrayList<>();
            for (Mealorder mealorder : order.getMealorders()) {
                if (Objects.equals(mealorder.getMeal().getId(), mealId)) {
                    mealOrders.add(mealorder);
                }
            }
            order.setMealorders(mealOrders);

        }
        return orderList;
    }

    public ResponseEntity<Mealorder> updateOrderStatus(UpdateOrderStatus updateOrderStatus) {
        Mealorder mealorder = mealorderRepository.findById(updateOrderStatus.getMealOrderId()).orElseThrow();
        mealorder.setStatus(updateOrderStatus.getStatus());
        Mealorder updatedMealorder = mealorderRepository.save(mealorder);
        try {
            String email = userDetailsRepository.findById(updateOrderStatus.getCustomerId()).get().getEmail();
            senderService.sendSimpleEmail(email, "Order Status Update",
                    "You order status for order " + updateOrderStatus.getOrderId() + " is " + updateOrderStatus.getStatus());
        } catch (Exception e) {

        }

        return ResponseEntity.status(HttpStatus.CREATED).body(updatedMealorder);
    }
}
