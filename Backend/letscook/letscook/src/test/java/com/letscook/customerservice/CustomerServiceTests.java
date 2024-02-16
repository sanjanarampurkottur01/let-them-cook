package com.letscook.customerservice;

import com.letscook.customer.model.CreateCustomerProfileInput;
import com.letscook.customer.model.Customer;
import com.letscook.customer.repository.CustomerRepository;
import com.letscook.customer.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

public class CustomerServiceTests {
    @InjectMocks
    private CustomerService customerService;

    @Mock
    private CustomerRepository customerRepository;
    
    private static final Long ID = 1L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    private CreateCustomerProfileInput createDummyCreateCustomerProfileInput() {
        CreateCustomerProfileInput input = new CreateCustomerProfileInput();
        input.setUserId(ID);
        input.setName("Nikunj Hudka");
        input.setPhoneNumber("1234567890");
        return input;
    }

    @Test
    void testCreateCustomerProfile() throws IOException {
        // Mocking
        CreateCustomerProfileInput input = createDummyCreateCustomerProfileInput();
        Customer expectedCustomer = new Customer();
        expectedCustomer.setId(ID);
        expectedCustomer.setName(input.getName());
        expectedCustomer.setPhoneNumber(input.getPhoneNumber());
        when(customerRepository.save(any(Customer.class))).thenReturn(expectedCustomer);

        // Test the method
        ResponseEntity<Customer> response = customerService.createCustomerProfile(input);

        // Assertions
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(expectedCustomer, response.getBody());
    }

    @Test
    void testUpdateCustomerProfile() throws IOException {
        // Mocking
        CreateCustomerProfileInput input = createDummyCreateCustomerProfileInput();
        Customer existingCustomer = new Customer();
        existingCustomer.setId(input.getUserId());
        existingCustomer.setName("Old Name");
        existingCustomer.setPhoneNumber("9876543210");

        when(customerRepository.findById(ID)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

        // Test the method
        ResponseEntity<Customer> response = customerService.updateCustomerProfile(input);

        // Assertions
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(input.getUserId(), response.getBody().getId());
        assertEquals(input.getName(), response.getBody().getName());
        assertEquals(input.getPhoneNumber(), response.getBody().getPhoneNumber());
    }

    @Test
    void testUpdateCustomerProfileWithoutAllData() throws IOException {
        // Mocking
        CreateCustomerProfileInput input = createDummyCreateCustomerProfileInput();
        Customer existingCustomer = new Customer();
        existingCustomer.setId(input.getUserId());
        input.setPhoneNumber(null);
        input.setName(null);

        when(customerRepository.findById(ID)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

        // Test the method
        ResponseEntity<Customer> response = customerService.updateCustomerProfile(input);

        // Assertions
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(input.getUserId(), response.getBody().getId());
        assertEquals(input.getName(), response.getBody().getName());
        assertEquals(input.getPhoneNumber(), response.getBody().getPhoneNumber());
    }

    @Test
    void testGetCustomerById() {
        // Mocking
        Long customerId = ID;
        Customer expectedCustomer = new Customer();
        expectedCustomer.setId(customerId);
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(expectedCustomer));

        // Test the method
        Customer result = customerService.getCustomerById(customerId);

        // Assertions
        assertNotNull(result);
        assertEquals(expectedCustomer, result);
    }

    @Test
    void testGetAllCustomers() {
        // Mocking
        List<Customer> expectedCustomers = Arrays.asList(new Customer(), new Customer());
        when(customerRepository.findAll()).thenReturn(expectedCustomers);

        // Test the method
        List<Customer> result = customerService.getAllCustomers();

        // Assertions
        assertNotNull(result);
        assertEquals(expectedCustomers.size(), result.size());
    }

    @Test
    void testDeleteCustomerById() {
        // Mocking
        Long customerId = ID;
        Customer customerToDelete = new Customer();
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customerToDelete));

        // Test the method
        Customer result = customerService.deleteCustomerById(customerId);

        // Assertions
        assertNotNull(result);
        assertEquals(customerToDelete, result);
    }
}
