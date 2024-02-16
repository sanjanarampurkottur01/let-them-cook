package com.letscook.cook.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCookProfileInput {
    private Long userId;
    private String businessName;
    private String address;
    private String profilePhoto;
    private String bannerImage;
    private String businessDocument;
}
