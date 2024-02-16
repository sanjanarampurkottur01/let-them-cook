package com.letscook.userdetails.service;

import com.letscook.userdetails.model.JwtResponse;
import com.letscook.userdetails.model.UserInfo;
import com.letscook.userdetails.model.UserInput;
import com.letscook.userdetails.repository.UserDetailsRepository;
import com.letscook.util.EmailSenderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private static final String USER_EMAIL = "test@example.com";
    private static final String USER_PASSWORD = "password123";
    private static final String INVALID_PASSWORD = "invalidpassword";
    private static final String NOT_EXISTENT_EMAIL = "nonexistent@example.com";
    @InjectMocks
    private UserService userService;
    @Mock
    private UserDetailsRepository userDetailsRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtEncoder jwtEncoder;
    @Mock
    private EmailSenderService emailSenderService;
    @Mock
    private Jwt jwt;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterThrowsException() throws Exception {
        List<UserInfo> userDetailList = new ArrayList<>();
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail(USER_EMAIL);
        when(passwordEncoder.encode(USER_PASSWORD)).thenReturn(new BCryptPasswordEncoder().encode(USER_PASSWORD));
        userInfo.setPassword(new BCryptPasswordEncoder().encode(USER_PASSWORD));
        userInfo.setName("Group17");
        userInfo.setRole("Admin");
        userDetailList.add(userInfo);
        when(userDetailsRepository.findByEmail(userInfo.getEmail())).
                thenReturn(userDetailList);
        assertThrows(Exception.class, () -> userService.register(userInfo));
    }

    @Test
    void testRegisterWhenSuccess() throws Exception {
        when(userDetailsRepository.findByEmail(Mockito.any())).
                thenReturn(new ArrayList<>());
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail(USER_EMAIL);
        when(passwordEncoder.encode(USER_PASSWORD)).
                thenReturn(new BCryptPasswordEncoder().encode(USER_PASSWORD));
        userInfo.setPassword(new BCryptPasswordEncoder().encode(USER_PASSWORD));
        userInfo.setName("Group17");
        userInfo.setRole("Admin");
        when(userDetailsRepository.save(userInfo)).thenReturn(userInfo);
        doReturn(true).when(emailSenderService).sendSimpleEmail(Mockito.any(), Mockito.any(),
                Mockito.any());
        ResponseEntity<UserInfo> responseEntity = userService.register(userInfo);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
    }

    @Test
    void testLoginSuccess() throws Exception {
        // Arrange
        UserInput userInput = new UserInput();
        userInput.setEmail(USER_EMAIL);
        userInput.setPassword(USER_PASSWORD);

        List<UserInfo> userDetailList = new ArrayList<>();
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail(USER_EMAIL);
        when(passwordEncoder.encode(USER_PASSWORD)).thenReturn(new BCryptPasswordEncoder().encode(USER_PASSWORD));
        userInfo.setPassword(new BCryptPasswordEncoder().encode(USER_PASSWORD));
        userInfo.setName("Group17");
        userInfo.setRole("Admin");
        userDetailList.add(userInfo);

        when(jwtEncoder.encode(Mockito.any())).thenReturn(jwt);
        when(jwt.getTokenValue()).thenReturn("Sample token");
        when(userDetailsRepository.findByEmail(userInput.getEmail())).
                thenReturn(userDetailList);
        when(passwordEncoder.matches(userInput.getPassword(), userInfo.getPassword())).
                thenReturn(true);

        // Act
        ResponseEntity<JwtResponse> responseEntity = userService.login(userInput);

        // Assert
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
    }

    @Test
    void testLoginInvalidPassword() {
        // Arrange
        UserInput userInput = new UserInput();
        userInput.setEmail(USER_EMAIL);
        userInput.setPassword(INVALID_PASSWORD);

        List<UserInfo> userDetailList = new ArrayList<>();
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail(USER_EMAIL);
        userInfo.setPassword(passwordEncoder.encode(USER_PASSWORD));
        userDetailList.add(userInfo);
        when(jwtEncoder.encode(Mockito.any())).thenReturn(jwt);
        when(jwt.getTokenValue()).thenReturn("Sample token");
        when(userDetailsRepository.findByEmail(userInput.getEmail())).
                thenReturn(userDetailList);
        when(passwordEncoder.matches(userInput.getPassword(), userInfo.getPassword())).
                thenReturn(false);

        // Act and Assert
        assertThrows(Exception.class, () -> userService.login(userInput),
                "credentials doesn't match");
    }

    @Test
    void testLoginUserDoesNotExist() {
        // Arrange
        UserInput userInput = new UserInput();
        userInput.setEmail(NOT_EXISTENT_EMAIL);
        userInput.setPassword(USER_PASSWORD);
        when(userDetailsRepository.findByEmail(userInput.getEmail())).
                thenReturn(new ArrayList<>());

        // Act and Assert
        assertThrows(Exception.class, () -> userService.login(userInput),
                "user doesn't exist");
    }

    @Test
    void testGetUserName() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail(USER_EMAIL);

        // Act and Assert
        assertTrue(userInfo.getEmail() == userInfo.getUsername());
    }

    @Test
    void testisAccountNonExpired() {
        // Arrange
        UserInfo userInfo = new UserInfo();

        // Act and Assert
        assertTrue(userInfo.isAccountNonExpired());
    }

    @Test
    void testIsAccountNonLocked() {
        // Arrange
        UserInfo userInfo = new UserInfo();

        // Act and Assert
        assertTrue(userInfo.isAccountNonLocked());
    }

    @Test
    void testIsCredentialsNonExpired() {
        // Arrange
        UserInfo userInfo = new UserInfo();

        // Act and Assert
        assertTrue(userInfo.isCredentialsNonExpired());
    }

    @Test
    void testIsEnabled() {
        // Arrange
        UserInfo userInfo = new UserInfo();

        // Act and Assert
        assertTrue(userInfo.isEnabled());
    }

    @Test
    void testUserId() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        Long id = 1L;
        userInfo.setId(id);

        // Act and Assert
        assertTrue(userInfo.getId() == id);
    }

    @Test
    void testUserRole() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        String role = "cook";
        userInfo.setRole(role);

        // Act and Assert
        assertTrue(userInfo.getRole() == role);
    }
}
