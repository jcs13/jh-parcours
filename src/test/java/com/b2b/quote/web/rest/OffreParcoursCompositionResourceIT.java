package com.b2b.quote.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.b2b.quote.IntegrationTest;
import com.b2b.quote.domain.OffreParcoursComposition;
import com.b2b.quote.repository.OffreParcoursCompositionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OffreParcoursCompositionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OffreParcoursCompositionResourceIT {

    private static final Boolean DEFAULT_START = false;
    private static final Boolean UPDATED_START = true;

    private static final String ENTITY_API_URL = "/api/offre-parcours-compositions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OffreParcoursCompositionRepository offreParcoursCompositionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOffreParcoursCompositionMockMvc;

    private OffreParcoursComposition offreParcoursComposition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffreParcoursComposition createEntity(EntityManager em) {
        OffreParcoursComposition offreParcoursComposition = new OffreParcoursComposition().start(DEFAULT_START);
        return offreParcoursComposition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffreParcoursComposition createUpdatedEntity(EntityManager em) {
        OffreParcoursComposition offreParcoursComposition = new OffreParcoursComposition().start(UPDATED_START);
        return offreParcoursComposition;
    }

    @BeforeEach
    public void initTest() {
        offreParcoursComposition = createEntity(em);
    }

    @Test
    @Transactional
    void createOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeCreate = offreParcoursCompositionRepository.findAll().size();
        // Create the OffreParcoursComposition
        restOffreParcoursCompositionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isCreated());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeCreate + 1);
        OffreParcoursComposition testOffreParcoursComposition = offreParcoursCompositionList.get(offreParcoursCompositionList.size() - 1);
        assertThat(testOffreParcoursComposition.getStart()).isEqualTo(DEFAULT_START);
    }

    @Test
    @Transactional
    void createOffreParcoursCompositionWithExistingId() throws Exception {
        // Create the OffreParcoursComposition with an existing ID
        offreParcoursComposition.setId(1L);

        int databaseSizeBeforeCreate = offreParcoursCompositionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffreParcoursCompositionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOffreParcoursCompositions() throws Exception {
        // Initialize the database
        offreParcoursCompositionRepository.saveAndFlush(offreParcoursComposition);

        // Get all the offreParcoursCompositionList
        restOffreParcoursCompositionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offreParcoursComposition.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.booleanValue())));
    }

    @Test
    @Transactional
    void getOffreParcoursComposition() throws Exception {
        // Initialize the database
        offreParcoursCompositionRepository.saveAndFlush(offreParcoursComposition);

        // Get the offreParcoursComposition
        restOffreParcoursCompositionMockMvc
            .perform(get(ENTITY_API_URL_ID, offreParcoursComposition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offreParcoursComposition.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingOffreParcoursComposition() throws Exception {
        // Get the offreParcoursComposition
        restOffreParcoursCompositionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOffreParcoursComposition() throws Exception {
        // Initialize the database
        offreParcoursCompositionRepository.saveAndFlush(offreParcoursComposition);

        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();

        // Update the offreParcoursComposition
        OffreParcoursComposition updatedOffreParcoursComposition = offreParcoursCompositionRepository
            .findById(offreParcoursComposition.getId())
            .get();
        // Disconnect from session so that the updates on updatedOffreParcoursComposition are not directly saved in db
        em.detach(updatedOffreParcoursComposition);
        updatedOffreParcoursComposition.start(UPDATED_START);

        restOffreParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffreParcoursComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOffreParcoursComposition))
            )
            .andExpect(status().isOk());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
        OffreParcoursComposition testOffreParcoursComposition = offreParcoursCompositionList.get(offreParcoursCompositionList.size() - 1);
        assertThat(testOffreParcoursComposition.getStart()).isEqualTo(UPDATED_START);
    }

    @Test
    @Transactional
    void putNonExistingOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();
        offreParcoursComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offreParcoursComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();
        offreParcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();
        offreParcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOffreParcoursCompositionWithPatch() throws Exception {
        // Initialize the database
        offreParcoursCompositionRepository.saveAndFlush(offreParcoursComposition);

        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();

        // Update the offreParcoursComposition using partial update
        OffreParcoursComposition partialUpdatedOffreParcoursComposition = new OffreParcoursComposition();
        partialUpdatedOffreParcoursComposition.setId(offreParcoursComposition.getId());

        restOffreParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffreParcoursComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffreParcoursComposition))
            )
            .andExpect(status().isOk());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
        OffreParcoursComposition testOffreParcoursComposition = offreParcoursCompositionList.get(offreParcoursCompositionList.size() - 1);
        assertThat(testOffreParcoursComposition.getStart()).isEqualTo(DEFAULT_START);
    }

    @Test
    @Transactional
    void fullUpdateOffreParcoursCompositionWithPatch() throws Exception {
        // Initialize the database
        offreParcoursCompositionRepository.saveAndFlush(offreParcoursComposition);

        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();

        // Update the offreParcoursComposition using partial update
        OffreParcoursComposition partialUpdatedOffreParcoursComposition = new OffreParcoursComposition();
        partialUpdatedOffreParcoursComposition.setId(offreParcoursComposition.getId());

        partialUpdatedOffreParcoursComposition.start(UPDATED_START);

        restOffreParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffreParcoursComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffreParcoursComposition))
            )
            .andExpect(status().isOk());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
        OffreParcoursComposition testOffreParcoursComposition = offreParcoursCompositionList.get(offreParcoursCompositionList.size() - 1);
        assertThat(testOffreParcoursComposition.getStart()).isEqualTo(UPDATED_START);
    }

    @Test
    @Transactional
    void patchNonExistingOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();
        offreParcoursComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offreParcoursComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();
        offreParcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffreParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreParcoursCompositionRepository.findAll().size();
        offreParcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreParcoursComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffreParcoursComposition in the database
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffreParcoursComposition() throws Exception {
        // Initialize the database
        offreParcoursCompositionRepository.saveAndFlush(offreParcoursComposition);

        int databaseSizeBeforeDelete = offreParcoursCompositionRepository.findAll().size();

        // Delete the offreParcoursComposition
        restOffreParcoursCompositionMockMvc
            .perform(delete(ENTITY_API_URL_ID, offreParcoursComposition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OffreParcoursComposition> offreParcoursCompositionList = offreParcoursCompositionRepository.findAll();
        assertThat(offreParcoursCompositionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
