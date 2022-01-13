package com.b2b.quote.repository;

import com.b2b.quote.domain.Element;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Element entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ElementRepository extends JpaRepository<Element, String> {}
