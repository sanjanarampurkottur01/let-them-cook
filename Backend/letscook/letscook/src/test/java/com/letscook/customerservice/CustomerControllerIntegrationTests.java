package com.letscook.customerservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.letscook.LetscookApplication;
import com.letscook.customer.model.CreateCustomerProfileInput;
import com.letscook.customer.model.Customer;
import com.letscook.userdetails.model.UserInput;
import com.letscook.userdetails.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest(classes = LetscookApplication.class)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(MockitoExtension.class)
public class CustomerControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    private String jwtToken;

    @BeforeEach
    void loginUser() throws Exception {
        UserInput userInput = new UserInput();
        userInput.setEmail("test@gmail.com");
        userInput.setPassword("test");
        this.jwtToken = userService.login(userInput).getBody().token();
    }


    @Test
    public void testGetCustomers() throws Exception {
        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.get("/customers")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void testGetCustomerById() throws Exception {
        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.get("/customers/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L));
    }

    @Test
    public void testCreateCustomerProfile() throws Exception {
        // Create test data
        CreateCustomerProfileInput createCustomerProfileInput = new CreateCustomerProfileInput();
        createCustomerProfileInput.setUserId(1L);
        createCustomerProfileInput.setName("Test Customer");

        // Mock the service response
        Customer mockedCustomer = new Customer();
        mockedCustomer.setId(1L);
        mockedCustomer.setName("Test Customer");
        // Add other properties as needed
//        when(customerService.createCustomerProfile(any())).thenReturn(ResponseEntity.ok(mockedCustomer));

        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.post("/customers/createProfile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createCustomerProfileInput))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Customer"));
    }

    @Test
    public void testUpdateCustomerProfile() throws Exception {
        // Create test data
        CreateCustomerProfileInput updateCustomerProfileInput = new CreateCustomerProfileInput();
        updateCustomerProfileInput.setUserId(1L);
        updateCustomerProfileInput.setName("Updated Customer");

        // Mock the service response
        Customer mockedCustomer = new Customer();
        mockedCustomer.setId(1L);
        mockedCustomer.setName("Updated Customer");
        // Add other properties as needed
//        when(customerService.updateCustomerProfile(any())).thenReturn(ResponseEntity.ok(mockedCustomer));

        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.post("/customers/updateProfile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateCustomerProfileInput))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Updated Customer"));
    }

//    @Test
//    public void testDeleteCustomer() throws Exception {
//        // Mock the service response
//        Customer mockedCustomer = new Customer();
//        mockedCustomer.setId(1L);
//        mockedCustomer.setName("Deleted Customer");
//        // Add other properties as needed
////        when(customerService.deleteCustomerById(1L)).thenReturn(mockedCustomer);
//
//        // Perform the request and assert the response
//        mockMvc.perform(MockMvcRequestBuilders.delete("/customers/deleteCustomer/1")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Deleted Customer"));
//    }
}
