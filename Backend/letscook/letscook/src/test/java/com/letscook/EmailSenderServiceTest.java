package com.letscook;

import com.letscook.util.EmailSenderService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class EmailSenderServiceTest {
    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailSenderService emailSenderService;

    @Test
    public void testSendSimpleEmail() {
        String fromEmail = "fromemail@gmail.com";
        String toEmail = "test@gmail.com";
        String body = "You have successfully registerd";
        doNothing().when(javaMailSender).send(any(SimpleMailMessage.class));
        assertTrue(emailSenderService.sendSimpleEmail(fromEmail, toEmail, body));

    }
}
