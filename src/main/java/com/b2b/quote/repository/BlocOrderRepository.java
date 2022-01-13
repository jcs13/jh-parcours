package com.b2b.quote.repository;

import com.b2b.quote.domain.BlocOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BlocOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlocOrderRepository extends JpaRepository<BlocOrder, Long> {}
