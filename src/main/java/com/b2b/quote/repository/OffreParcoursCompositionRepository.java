package com.b2b.quote.repository;

import com.b2b.quote.domain.OffreParcoursComposition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OffreParcoursComposition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffreParcoursCompositionRepository extends JpaRepository<OffreParcoursComposition, Long> {}
