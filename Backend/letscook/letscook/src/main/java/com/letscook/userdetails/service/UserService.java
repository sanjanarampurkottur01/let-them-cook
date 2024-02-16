package com.letscook.userdetails.service;


import com.letscook.userdetails.model.JwtResponse;
import com.letscook.userdetails.model.UserInfo;
import com.letscook.userdetails.model.UserInput;
import com.letscook.userdetails.repository.UserDetailsRepository;
import com.letscook.util.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserDetailsRepository userDetailsRepository;
    @Autowired
    private JwtEncoder jwtEncoder;
    @Autowired
    private EmailSenderService senderService;

    private static final int EXPIRE_AFTER_SECONDS = 1800;

    public ResponseEntity<UserInfo> register(UserInfo userDetails) throws Exception {
        List<UserInfo> userDetailList = userDetailsRepository.
                findByEmail(userDetails.getEmail());
        if (!userDetailList.isEmpty()) {
            throw new Exception("User already exists!!");
        } else {
            userDetails.setPassword(passwordEncoder().encode(userDetails.getPassword()));
            UserInfo createdUser = userDetailsRepository.save(userDetails);
            senderService.sendSimpleEmail(userDetails.getEmail(), "Registration",
                    "You have successfully registered");
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        }
    }

    public ResponseEntity<JwtResponse> login(UserInput userInput) throws Exception {
        List<UserInfo> userDetailList = userDetailsRepository.
                findByEmail(userInput.getEmail());
        if (!userDetailList.isEmpty()) {
            if (passwordEncoder().matches(userInput.getPassword(),
                    userDetailList.get(0).getPassword())) {
                UserInfo userInfo = userDetailList.get(0);
                String token = createToken(userInfo);
                JwtResponse jwtResponse = new JwtResponse(userInfo, token);
                return ResponseEntity.status(HttpStatus.OK).body(jwtResponse);
            } else {
                throw new Exception("credentials doesn't match");
            }
        } else {
            throw new Exception("user doesn't exist");
        }
    }

    private String createToken(UserInfo userInfo) {
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        jwtClaimsSetBuilder.issuer("self");
        jwtClaimsSetBuilder.issuedAt(Instant.now());
        jwtClaimsSetBuilder.expiresAt(Instant.now().plusSeconds(EXPIRE_AFTER_SECONDS));
        jwtClaimsSetBuilder.subject(userInfo.getName());
        jwtClaimsSetBuilder.claim("scope", createScope(userInfo));
        var claims = jwtClaimsSetBuilder.build();
        return jwtEncoder.encode(JwtEncoderParameters.from(claims))
                .getTokenValue();
    }

    private String createScope(UserInfo userInfo) {
        return userInfo.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
    }

    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
