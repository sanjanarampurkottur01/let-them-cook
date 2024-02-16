package com.letscook.customer.controller;

import com.letscook.customer.model.CreateCustomerProfileInput;
import com.letscook.customer.model.Customer;
import com.letscook.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping()
    public List<Customer> getCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable() Long id) {
        return customerService.getCustomerById(id);
    }

    @PostMapping("/createProfile")
    public ResponseEntity<Customer> createCustomerProfile(@RequestBody CreateCustomerProfileInput createCustomerProfileInput) throws IOException {
        return customerService.createCustomerProfile(createCustomerProfileInput);
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<Customer> updateCookProfile(@RequestBody CreateCustomerProfileInput updateCustomerProfileInput) throws IOException {
        return customerService.updateCustomerProfile(updateCustomerProfileInput);
    }

    @DeleteMapping("/deleteCustomer/{id}")
    public Customer deleteCustomer(@PathVariable() Long id) {
        return customerService.deleteCustomerById(id);
    }
}
