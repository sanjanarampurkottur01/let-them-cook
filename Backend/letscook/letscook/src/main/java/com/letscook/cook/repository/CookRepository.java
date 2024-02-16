package com.letscook.cook.repository;

import com.letscook.cook.model.Cook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CookRepository extends JpaRepository<Cook, Long> {

    List<Cook> findAllByStatusIs(String status);
    List<Cook> findAllByBusinessNameIsLikeIgnoreCase(String businessName);
}
