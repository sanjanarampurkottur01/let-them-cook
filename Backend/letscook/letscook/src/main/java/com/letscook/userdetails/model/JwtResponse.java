package com.letscook.userdetails.model;

import com.letscook.userdetails.model.UserInfo;

public record JwtResponse(UserInfo userInfo, String token) {
}
