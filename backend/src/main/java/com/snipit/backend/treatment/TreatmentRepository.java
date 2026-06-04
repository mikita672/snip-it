package com.snipit.backend.treatment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Integer> {
	Page<Treatment> findByNameContainsIgnoreCase(String searchToken, Pageable pageable);
}
