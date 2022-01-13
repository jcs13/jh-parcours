package com.b2b.quote.web.rest;

import com.b2b.quote.domain.EtapeOrder;
import com.b2b.quote.repository.EtapeOrderRepository;
import com.b2b.quote.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.b2b.quote.domain.EtapeOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EtapeOrderResource {

    private final Logger log = LoggerFactory.getLogger(EtapeOrderResource.class);

    private static final String ENTITY_NAME = "etapeOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtapeOrderRepository etapeOrderRepository;

    public EtapeOrderResource(EtapeOrderRepository etapeOrderRepository) {
        this.etapeOrderRepository = etapeOrderRepository;
    }

    /**
     * {@code POST  /etape-orders} : Create a new etapeOrder.
     *
     * @param etapeOrder the etapeOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etapeOrder, or with status {@code 400 (Bad Request)} if the etapeOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/etape-orders")
    public ResponseEntity<EtapeOrder> createEtapeOrder(@RequestBody EtapeOrder etapeOrder) throws URISyntaxException {
        log.debug("REST request to save EtapeOrder : {}", etapeOrder);
        if (etapeOrder.getId() != null) {
            throw new BadRequestAlertException("A new etapeOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EtapeOrder result = etapeOrderRepository.save(etapeOrder);
        return ResponseEntity
            .created(new URI("/api/etape-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /etape-orders/:id} : Updates an existing etapeOrder.
     *
     * @param id the id of the etapeOrder to save.
     * @param etapeOrder the etapeOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etapeOrder,
     * or with status {@code 400 (Bad Request)} if the etapeOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etapeOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/etape-orders/{id}")
    public ResponseEntity<EtapeOrder> updateEtapeOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EtapeOrder etapeOrder
    ) throws URISyntaxException {
        log.debug("REST request to update EtapeOrder : {}, {}", id, etapeOrder);
        if (etapeOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etapeOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etapeOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EtapeOrder result = etapeOrderRepository.save(etapeOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etapeOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /etape-orders/:id} : Partial updates given fields of an existing etapeOrder, field will ignore if it is null
     *
     * @param id the id of the etapeOrder to save.
     * @param etapeOrder the etapeOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etapeOrder,
     * or with status {@code 400 (Bad Request)} if the etapeOrder is not valid,
     * or with status {@code 404 (Not Found)} if the etapeOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the etapeOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/etape-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EtapeOrder> partialUpdateEtapeOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EtapeOrder etapeOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update EtapeOrder partially : {}, {}", id, etapeOrder);
        if (etapeOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etapeOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etapeOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EtapeOrder> result = etapeOrderRepository
            .findById(etapeOrder.getId())
            .map(existingEtapeOrder -> {
                if (etapeOrder.getStart() != null) {
                    existingEtapeOrder.setStart(etapeOrder.getStart());
                }

                return existingEtapeOrder;
            })
            .map(etapeOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etapeOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /etape-orders} : get all the etapeOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etapeOrders in body.
     */
    @GetMapping("/etape-orders")
    public List<EtapeOrder> getAllEtapeOrders() {
        log.debug("REST request to get all EtapeOrders");
        return etapeOrderRepository.findAll();
    }

    /**
     * {@code GET  /etape-orders/:id} : get the "id" etapeOrder.
     *
     * @param id the id of the etapeOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etapeOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/etape-orders/{id}")
    public ResponseEntity<EtapeOrder> getEtapeOrder(@PathVariable Long id) {
        log.debug("REST request to get EtapeOrder : {}", id);
        Optional<EtapeOrder> etapeOrder = etapeOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(etapeOrder);
    }

    /**
     * {@code DELETE  /etape-orders/:id} : delete the "id" etapeOrder.
     *
     * @param id the id of the etapeOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/etape-orders/{id}")
    public ResponseEntity<Void> deleteEtapeOrder(@PathVariable Long id) {
        log.debug("REST request to delete EtapeOrder : {}", id);
        etapeOrderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
