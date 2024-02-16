package com.letscook.cook.controller;

import com.letscook.cook.model.Cook;
import com.letscook.cook.model.CreateCookProfileInput;
import com.letscook.cook.model.UpdateCookProfileInput;
import com.letscook.cook.service.CookService;
import com.letscook.menu.model.dish.Dish;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/cooks")
public class CookController {

    @Autowired
    private CookService cookService;

    @GetMapping()
    public List<Cook> getCooks() {
        return cookService.getCooks();
    }

    @GetMapping("/cookSearch")
    public List<Cook> getCooksByBusinessName(@RequestParam String businessName) {
        return cookService.getCooksByName(businessName);
    }

    @GetMapping("/{id}")
    public Cook getCook(@PathVariable() Long id) {
        return cookService.getCook(id);
    }

    @PostMapping("/createProfile")
    public ResponseEntity<Cook> createCookProfile(@RequestBody() CreateCookProfileInput createCookProfileInput) throws IOException {
        return cookService.createCookProfile(createCookProfileInput);
    }

    @GetMapping("/pendingCooks")
    public List<Cook> getAllPendingCooks() {
        return cookService.getAllPendingCook();
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<Cook> updateCookProfile(@RequestBody() UpdateCookProfileInput updateCookProfileInput) throws IOException {
        return cookService.updateCookProfile(updateCookProfileInput);
    }

    @GetMapping("/getDishes/{id}")
    public List<Dish> getDishesByCookId(@PathVariable() Long id) {
        return cookService.getDishesByCookId(id);
    }
}
