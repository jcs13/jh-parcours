package com.b2b.quote.repository;

import com.b2b.quote.domain.BlocDefinition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BlocDefinition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlocDefinitionRepository extends JpaRepository<BlocDefinition, String> {}
