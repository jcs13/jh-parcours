package com.b2b.quote.web.rest;

import com.b2b.quote.domain.BlocOrder;
import com.b2b.quote.repository.BlocOrderRepository;
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
 * REST controller for managing {@link com.b2b.quote.domain.BlocOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlocOrderResource {

    private final Logger log = LoggerFactory.getLogger(BlocOrderResource.class);

    private static final String ENTITY_NAME = "blocOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlocOrderRepository blocOrderRepository;

    public BlocOrderResource(BlocOrderRepository blocOrderRepository) {
        this.blocOrderRepository = blocOrderRepository;
    }

    /**
     * {@code POST  /bloc-orders} : Create a new blocOrder.
     *
     * @param blocOrder the blocOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blocOrder, or with status {@code 400 (Bad Request)} if the blocOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bloc-orders")
    public ResponseEntity<BlocOrder> createBlocOrder(@RequestBody BlocOrder blocOrder) throws URISyntaxException {
        log.debug("REST request to save BlocOrder : {}", blocOrder);
        if (blocOrder.getId() != null) {
            throw new BadRequestAlertException("A new blocOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlocOrder result = blocOrderRepository.save(blocOrder);
        return ResponseEntity
            .created(new URI("/api/bloc-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bloc-orders/:id} : Updates an existing blocOrder.
     *
     * @param id the id of the blocOrder to save.
     * @param blocOrder the blocOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blocOrder,
     * or with status {@code 400 (Bad Request)} if the blocOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blocOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bloc-orders/{id}")
    public ResponseEntity<BlocOrder> updateBlocOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BlocOrder blocOrder
    ) throws URISyntaxException {
        log.debug("REST request to update BlocOrder : {}, {}", id, blocOrder);
        if (blocOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blocOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BlocOrder result = blocOrderRepository.save(blocOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blocOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bloc-orders/:id} : Partial updates given fields of an existing blocOrder, field will ignore if it is null
     *
     * @param id the id of the blocOrder to save.
     * @param blocOrder the blocOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blocOrder,
     * or with status {@code 400 (Bad Request)} if the blocOrder is not valid,
     * or with status {@code 404 (Not Found)} if the blocOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the blocOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bloc-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BlocOrder> partialUpdateBlocOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BlocOrder blocOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update BlocOrder partially : {}, {}", id, blocOrder);
        if (blocOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blocOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BlocOrder> result = blocOrderRepository
            .findById(blocOrder.getId())
            .map(existingBlocOrder -> {
                if (blocOrder.getStart() != null) {
                    existingBlocOrder.setStart(blocOrder.getStart());
                }

                return existingBlocOrder;
            })
            .map(blocOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blocOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /bloc-orders} : get all the blocOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blocOrders in body.
     */
    @GetMapping("/bloc-orders")
    public List<BlocOrder> getAllBlocOrders() {
        log.debug("REST request to get all BlocOrders");
        return blocOrderRepository.findAll();
    }

    /**
     * {@code GET  /bloc-orders/:id} : get the "id" blocOrder.
     *
     * @param id the id of the blocOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blocOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bloc-orders/{id}")
    public ResponseEntity<BlocOrder> getBlocOrder(@PathVariable Long id) {
        log.debug("REST request to get BlocOrder : {}", id);
        Optional<BlocOrder> blocOrder = blocOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blocOrder);
    }

    /**
     * {@code DELETE  /bloc-orders/:id} : delete the "id" blocOrder.
     *
     * @param id the id of the blocOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bloc-orders/{id}")
    public ResponseEntity<Void> deleteBlocOrder(@PathVariable Long id) {
        log.debug("REST request to delete BlocOrder : {}", id);
        blocOrderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
