package com.letscook.customer.service;

import com.letscook.customer.model.CreateCustomerProfileInput;
import com.letscook.customer.model.Customer;
import com.letscook.customer.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public ResponseEntity<Customer> createCustomerProfile(CreateCustomerProfileInput createCustomerProfileInput) {
        Customer customerToUpdate = new Customer();
        customerToUpdate.setId(createCustomerProfileInput.getUserId());
        customerToUpdate.setName(createCustomerProfileInput.getName());
        customerToUpdate.setPhoneNumber(createCustomerProfileInput.getPhoneNumber());
        Customer updatedCustomer = customerRepository.save(customerToUpdate);
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedCustomer);
    }

    public ResponseEntity<Customer> updateCustomerProfile(CreateCustomerProfileInput updateCustomerProfileInput)  {
        Customer customerToUpdate = getCustomerById(updateCustomerProfileInput.getUserId());
        if(customerToUpdate == null) {
            throw new EntityNotFoundException("Customer not found for : " +
                    updateCustomerProfileInput.getUserId());
        }

        if (updateCustomerProfileInput.getName() != null) {
            customerToUpdate.setName(updateCustomerProfileInput.getName());
        }
        if (updateCustomerProfileInput.getPhoneNumber() != null) {
            customerToUpdate.setPhoneNumber(updateCustomerProfileInput.getPhoneNumber());
        }
        Customer updatedCustomer = customerRepository.save(customerToUpdate);
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedCustomer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer deleteCustomerById(Long id) {
        Customer customerToDelete = customerRepository.findById(id).orElseThrow();
        customerRepository.deleteById(id);
        return customerToDelete;
    }
}
