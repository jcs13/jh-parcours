package com.b2b.quote.repository;

import com.b2b.quote.domain.ParcoursDefinition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ParcoursDefinition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParcoursDefinitionRepository extends JpaRepository<ParcoursDefinition, String> {}
