package com.b2b.quote.repository;

import com.b2b.quote.domain.Bloc;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bloc entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long> {}
