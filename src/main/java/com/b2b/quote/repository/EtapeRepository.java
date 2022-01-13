package com.b2b.quote.repository;

import com.b2b.quote.domain.Etape;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Etape entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtapeRepository extends JpaRepository<Etape, String> {}
