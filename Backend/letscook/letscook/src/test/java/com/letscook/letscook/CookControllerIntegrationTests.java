package com.letscook.letscook;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.letscook.LetscookApplication;
import com.letscook.cook.model.Cook;
import com.letscook.cook.model.CreateCookProfileInput;
import com.letscook.cook.model.UpdateCookProfileInput;
import com.letscook.cook.repository.CookRepository;
import com.letscook.cook.service.CookService;
import com.letscook.userdetails.model.UserInput;
import com.letscook.userdetails.service.UserService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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
public class CookControllerIntegrationTests {

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
    public void testCreateCookProfile() throws Exception {
        // Create test data
        CreateCookProfileInput createCookProfileInput = new CreateCookProfileInput();
        createCookProfileInput.setUserId(1L);
        createCookProfileInput.setBusinessName("Test Business");
        createCookProfileInput.setAddress("Test Address");
        createCookProfileInput.setProfilePhoto("test.jpg");
        createCookProfileInput.setBannerImage("banner.jpg");
        createCookProfileInput.setBusinessDocument("doc.pdf");

        // Mock the service response
        Cook mockedCook = new Cook();
        mockedCook.setId(1L);
        mockedCook.setBusinessName("Test Business");
        mockedCook.setAddress("Test Address");
        mockedCook.setProfilePhoto("test.jpg");
        mockedCook.setBannerImage("banner.jpg");
        mockedCook.setBusinessDocument("doc.pdf");

        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.post("/cooks/createProfile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createCookProfileInput)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.businessName").value("Test Business"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Test Address"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.profilePhoto").value("test.jpg"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.bannerImage").value("banner.jpg"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.businessDocument").value("doc.pdf"));
    }

    @Test
    public void testGetCooks() throws Exception {

        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.get("/cooks")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void testGetCookById() throws Exception {
        // Mock the service response
        Cook mockedCook = new Cook();
        mockedCook.setId(1L);
        mockedCook.setBusinessName("Test Business");
        mockedCook.setAddress("Test Address");
        mockedCook.setProfilePhoto("test.jpg");
        mockedCook.setBannerImage("banner.jpg");
        mockedCook.setBusinessDocument("doc.pdf");
//        when(cookService.getCook(1L)).thenReturn(mockedCook);

        // Perform the request and assert the response
        mockMvc.perform(MockMvcRequestBuilders.get("/cooks/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.businessName").value("Test Business"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address").value("Test Address"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.profilePhoto").value("test.jpg"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.bannerImage").value("banner.jpg"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.businessDocument").value("doc.pdf"));
    }

    @Test
    public void testUpdateCookProfile() throws Exception {

        UpdateCookProfileInput updateCookProfileInput = new UpdateCookProfileInput();
        updateCookProfileInput.setId(1L);
        updateCookProfileInput.setAddress("Test Address");
        updateCookProfileInput.setProfilePhoto("test.jpg");
        updateCookProfileInput.setBannerImage("banner.jpg");

        // Perform the request with JWT token in the header
        mockMvc.perform(MockMvcRequestBuilders.post("/cooks/updateProfile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken)
                        .content(objectMapper.writeValueAsString(updateCookProfileInput)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.businessName").value("Test Business"));
    }

    @Test
    public void testGetDishesByCookIdWithToken() throws Exception {
        // Perform the request with JWT token in the header
        mockMvc.perform(MockMvcRequestBuilders.get("/cooks/getDishes/1")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + this.jwtToken))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

}
