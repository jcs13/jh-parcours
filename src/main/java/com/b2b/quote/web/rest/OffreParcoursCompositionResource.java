package com.b2b.quote.web.rest;

import com.b2b.quote.domain.OffreParcoursComposition;
import com.b2b.quote.repository.OffreParcoursCompositionRepository;
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
 * REST controller for managing {@link com.b2b.quote.domain.OffreParcoursComposition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OffreParcoursCompositionResource {

    private final Logger log = LoggerFactory.getLogger(OffreParcoursCompositionResource.class);

    private static final String ENTITY_NAME = "offreParcoursComposition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OffreParcoursCompositionRepository offreParcoursCompositionRepository;

    public OffreParcoursCompositionResource(OffreParcoursCompositionRepository offreParcoursCompositionRepository) {
        this.offreParcoursCompositionRepository = offreParcoursCompositionRepository;
    }

    /**
     * {@code POST  /offre-parcours-compositions} : Create a new offreParcoursComposition.
     *
     * @param offreParcoursComposition the offreParcoursComposition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offreParcoursComposition, or with status {@code 400 (Bad Request)} if the offreParcoursComposition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offre-parcours-compositions")
    public ResponseEntity<OffreParcoursComposition> createOffreParcoursComposition(
        @RequestBody OffreParcoursComposition offreParcoursComposition
    ) throws URISyntaxException {
        log.debug("REST request to save OffreParcoursComposition : {}", offreParcoursComposition);
        if (offreParcoursComposition.getId() != null) {
            throw new BadRequestAlertException("A new offreParcoursComposition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OffreParcoursComposition result = offreParcoursCompositionRepository.save(offreParcoursComposition);
        return ResponseEntity
            .created(new URI("/api/offre-parcours-compositions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offre-parcours-compositions/:id} : Updates an existing offreParcoursComposition.
     *
     * @param id the id of the offreParcoursComposition to save.
     * @param offreParcoursComposition the offreParcoursComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offreParcoursComposition,
     * or with status {@code 400 (Bad Request)} if the offreParcoursComposition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offreParcoursComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offre-parcours-compositions/{id}")
    public ResponseEntity<OffreParcoursComposition> updateOffreParcoursComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OffreParcoursComposition offreParcoursComposition
    ) throws URISyntaxException {
        log.debug("REST request to update OffreParcoursComposition : {}, {}", id, offreParcoursComposition);
        if (offreParcoursComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offreParcoursComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offreParcoursCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OffreParcoursComposition result = offreParcoursCompositionRepository.save(offreParcoursComposition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, offreParcoursComposition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /offre-parcours-compositions/:id} : Partial updates given fields of an existing offreParcoursComposition, field will ignore if it is null
     *
     * @param id the id of the offreParcoursComposition to save.
     * @param offreParcoursComposition the offreParcoursComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offreParcoursComposition,
     * or with status {@code 400 (Bad Request)} if the offreParcoursComposition is not valid,
     * or with status {@code 404 (Not Found)} if the offreParcoursComposition is not found,
     * or with status {@code 500 (Internal Server Error)} if the offreParcoursComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offre-parcours-compositions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OffreParcoursComposition> partialUpdateOffreParcoursComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OffreParcoursComposition offreParcoursComposition
    ) throws URISyntaxException {
        log.debug("REST request to partial update OffreParcoursComposition partially : {}, {}", id, offreParcoursComposition);
        if (offreParcoursComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offreParcoursComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offreParcoursCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OffreParcoursComposition> result = offreParcoursCompositionRepository
            .findById(offreParcoursComposition.getId())
            .map(existingOffreParcoursComposition -> {
                if (offreParcoursComposition.getStart() != null) {
                    existingOffreParcoursComposition.setStart(offreParcoursComposition.getStart());
                }

                return existingOffreParcoursComposition;
            })
            .map(offreParcoursCompositionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, offreParcoursComposition.getId().toString())
        );
    }

    /**
     * {@code GET  /offre-parcours-compositions} : get all the offreParcoursCompositions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offreParcoursCompositions in body.
     */
    @GetMapping("/offre-parcours-compositions")
    public List<OffreParcoursComposition> getAllOffreParcoursCompositions() {
        log.debug("REST request to get all OffreParcoursCompositions");
        return offreParcoursCompositionRepository.findAll();
    }

    /**
     * {@code GET  /offre-parcours-compositions/:id} : get the "id" offreParcoursComposition.
     *
     * @param id the id of the offreParcoursComposition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offreParcoursComposition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offre-parcours-compositions/{id}")
    public ResponseEntity<OffreParcoursComposition> getOffreParcoursComposition(@PathVariable Long id) {
        log.debug("REST request to get OffreParcoursComposition : {}", id);
        Optional<OffreParcoursComposition> offreParcoursComposition = offreParcoursCompositionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(offreParcoursComposition);
    }

    /**
     * {@code DELETE  /offre-parcours-compositions/:id} : delete the "id" offreParcoursComposition.
     *
     * @param id the id of the offreParcoursComposition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offre-parcours-compositions/{id}")
    public ResponseEntity<Void> deleteOffreParcoursComposition(@PathVariable Long id) {
        log.debug("REST request to delete OffreParcoursComposition : {}", id);
        offreParcoursCompositionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
