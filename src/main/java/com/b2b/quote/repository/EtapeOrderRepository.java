package com.b2b.quote.repository;

import com.b2b.quote.domain.EtapeOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EtapeOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtapeOrderRepository extends JpaRepository<EtapeOrder, Long> {}
