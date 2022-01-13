package com.b2b.quote.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.b2b.quote.IntegrationTest;
import com.b2b.quote.domain.EtapeOrder;
import com.b2b.quote.repository.EtapeOrderRepository;
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
 * Integration tests for the {@link EtapeOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtapeOrderResourceIT {

    private static final Boolean DEFAULT_START = false;
    private static final Boolean UPDATED_START = true;

    private static final String ENTITY_API_URL = "/api/etape-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EtapeOrderRepository etapeOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtapeOrderMockMvc;

    private EtapeOrder etapeOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtapeOrder createEntity(EntityManager em) {
        EtapeOrder etapeOrder = new EtapeOrder().start(DEFAULT_START);
        return etapeOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtapeOrder createUpdatedEntity(EntityManager em) {
        EtapeOrder etapeOrder = new EtapeOrder().start(UPDATED_START);
        return etapeOrder;
    }

    @BeforeEach
    public void initTest() {
        etapeOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createEtapeOrder() throws Exception {
        int databaseSizeBeforeCreate = etapeOrderRepository.findAll().size();
        // Create the EtapeOrder
        restEtapeOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeOrder)))
            .andExpect(status().isCreated());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeCreate + 1);
        EtapeOrder testEtapeOrder = etapeOrderList.get(etapeOrderList.size() - 1);
        assertThat(testEtapeOrder.getStart()).isEqualTo(DEFAULT_START);
    }

    @Test
    @Transactional
    void createEtapeOrderWithExistingId() throws Exception {
        // Create the EtapeOrder with an existing ID
        etapeOrder.setId(1L);

        int databaseSizeBeforeCreate = etapeOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtapeOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeOrder)))
            .andExpect(status().isBadRequest());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEtapeOrders() throws Exception {
        // Initialize the database
        etapeOrderRepository.saveAndFlush(etapeOrder);

        // Get all the etapeOrderList
        restEtapeOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etapeOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.booleanValue())));
    }

    @Test
    @Transactional
    void getEtapeOrder() throws Exception {
        // Initialize the database
        etapeOrderRepository.saveAndFlush(etapeOrder);

        // Get the etapeOrder
        restEtapeOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, etapeOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etapeOrder.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingEtapeOrder() throws Exception {
        // Get the etapeOrder
        restEtapeOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEtapeOrder() throws Exception {
        // Initialize the database
        etapeOrderRepository.saveAndFlush(etapeOrder);

        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();

        // Update the etapeOrder
        EtapeOrder updatedEtapeOrder = etapeOrderRepository.findById(etapeOrder.getId()).get();
        // Disconnect from session so that the updates on updatedEtapeOrder are not directly saved in db
        em.detach(updatedEtapeOrder);
        updatedEtapeOrder.start(UPDATED_START);

        restEtapeOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtapeOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEtapeOrder))
            )
            .andExpect(status().isOk());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
        EtapeOrder testEtapeOrder = etapeOrderList.get(etapeOrderList.size() - 1);
        assertThat(testEtapeOrder.getStart()).isEqualTo(UPDATED_START);
    }

    @Test
    @Transactional
    void putNonExistingEtapeOrder() throws Exception {
        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();
        etapeOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etapeOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etapeOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtapeOrder() throws Exception {
        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();
        etapeOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etapeOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtapeOrder() throws Exception {
        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();
        etapeOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtapeOrderWithPatch() throws Exception {
        // Initialize the database
        etapeOrderRepository.saveAndFlush(etapeOrder);

        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();

        // Update the etapeOrder using partial update
        EtapeOrder partialUpdatedEtapeOrder = new EtapeOrder();
        partialUpdatedEtapeOrder.setId(etapeOrder.getId());

        restEtapeOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtapeOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtapeOrder))
            )
            .andExpect(status().isOk());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
        EtapeOrder testEtapeOrder = etapeOrderList.get(etapeOrderList.size() - 1);
        assertThat(testEtapeOrder.getStart()).isEqualTo(DEFAULT_START);
    }

    @Test
    @Transactional
    void fullUpdateEtapeOrderWithPatch() throws Exception {
        // Initialize the database
        etapeOrderRepository.saveAndFlush(etapeOrder);

        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();

        // Update the etapeOrder using partial update
        EtapeOrder partialUpdatedEtapeOrder = new EtapeOrder();
        partialUpdatedEtapeOrder.setId(etapeOrder.getId());

        partialUpdatedEtapeOrder.start(UPDATED_START);

        restEtapeOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtapeOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtapeOrder))
            )
            .andExpect(status().isOk());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
        EtapeOrder testEtapeOrder = etapeOrderList.get(etapeOrderList.size() - 1);
        assertThat(testEtapeOrder.getStart()).isEqualTo(UPDATED_START);
    }

    @Test
    @Transactional
    void patchNonExistingEtapeOrder() throws Exception {
        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();
        etapeOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etapeOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtapeOrder() throws Exception {
        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();
        etapeOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtapeOrder() throws Exception {
        int databaseSizeBeforeUpdate = etapeOrderRepository.findAll().size();
        etapeOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeOrderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(etapeOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtapeOrder in the database
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtapeOrder() throws Exception {
        // Initialize the database
        etapeOrderRepository.saveAndFlush(etapeOrder);

        int databaseSizeBeforeDelete = etapeOrderRepository.findAll().size();

        // Delete the etapeOrder
        restEtapeOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, etapeOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EtapeOrder> etapeOrderList = etapeOrderRepository.findAll();
        assertThat(etapeOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
