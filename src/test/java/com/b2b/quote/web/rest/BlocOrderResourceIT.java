package com.b2b.quote.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.b2b.quote.IntegrationTest;
import com.b2b.quote.domain.BlocOrder;
import com.b2b.quote.repository.BlocOrderRepository;
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
 * Integration tests for the {@link BlocOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlocOrderResourceIT {

    private static final Boolean DEFAULT_START = false;
    private static final Boolean UPDATED_START = true;

    private static final String ENTITY_API_URL = "/api/bloc-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlocOrderRepository blocOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlocOrderMockMvc;

    private BlocOrder blocOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlocOrder createEntity(EntityManager em) {
        BlocOrder blocOrder = new BlocOrder().start(DEFAULT_START);
        return blocOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlocOrder createUpdatedEntity(EntityManager em) {
        BlocOrder blocOrder = new BlocOrder().start(UPDATED_START);
        return blocOrder;
    }

    @BeforeEach
    public void initTest() {
        blocOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createBlocOrder() throws Exception {
        int databaseSizeBeforeCreate = blocOrderRepository.findAll().size();
        // Create the BlocOrder
        restBlocOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocOrder)))
            .andExpect(status().isCreated());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeCreate + 1);
        BlocOrder testBlocOrder = blocOrderList.get(blocOrderList.size() - 1);
        assertThat(testBlocOrder.getStart()).isEqualTo(DEFAULT_START);
    }

    @Test
    @Transactional
    void createBlocOrderWithExistingId() throws Exception {
        // Create the BlocOrder with an existing ID
        blocOrder.setId(1L);

        int databaseSizeBeforeCreate = blocOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlocOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocOrder)))
            .andExpect(status().isBadRequest());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBlocOrders() throws Exception {
        // Initialize the database
        blocOrderRepository.saveAndFlush(blocOrder);

        // Get all the blocOrderList
        restBlocOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blocOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.booleanValue())));
    }

    @Test
    @Transactional
    void getBlocOrder() throws Exception {
        // Initialize the database
        blocOrderRepository.saveAndFlush(blocOrder);

        // Get the blocOrder
        restBlocOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, blocOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blocOrder.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingBlocOrder() throws Exception {
        // Get the blocOrder
        restBlocOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlocOrder() throws Exception {
        // Initialize the database
        blocOrderRepository.saveAndFlush(blocOrder);

        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();

        // Update the blocOrder
        BlocOrder updatedBlocOrder = blocOrderRepository.findById(blocOrder.getId()).get();
        // Disconnect from session so that the updates on updatedBlocOrder are not directly saved in db
        em.detach(updatedBlocOrder);
        updatedBlocOrder.start(UPDATED_START);

        restBlocOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlocOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlocOrder))
            )
            .andExpect(status().isOk());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
        BlocOrder testBlocOrder = blocOrderList.get(blocOrderList.size() - 1);
        assertThat(testBlocOrder.getStart()).isEqualTo(UPDATED_START);
    }

    @Test
    @Transactional
    void putNonExistingBlocOrder() throws Exception {
        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();
        blocOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blocOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blocOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlocOrder() throws Exception {
        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();
        blocOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blocOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlocOrder() throws Exception {
        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();
        blocOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlocOrderWithPatch() throws Exception {
        // Initialize the database
        blocOrderRepository.saveAndFlush(blocOrder);

        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();

        // Update the blocOrder using partial update
        BlocOrder partialUpdatedBlocOrder = new BlocOrder();
        partialUpdatedBlocOrder.setId(blocOrder.getId());

        restBlocOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlocOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlocOrder))
            )
            .andExpect(status().isOk());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
        BlocOrder testBlocOrder = blocOrderList.get(blocOrderList.size() - 1);
        assertThat(testBlocOrder.getStart()).isEqualTo(DEFAULT_START);
    }

    @Test
    @Transactional
    void fullUpdateBlocOrderWithPatch() throws Exception {
        // Initialize the database
        blocOrderRepository.saveAndFlush(blocOrder);

        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();

        // Update the blocOrder using partial update
        BlocOrder partialUpdatedBlocOrder = new BlocOrder();
        partialUpdatedBlocOrder.setId(blocOrder.getId());

        partialUpdatedBlocOrder.start(UPDATED_START);

        restBlocOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlocOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlocOrder))
            )
            .andExpect(status().isOk());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
        BlocOrder testBlocOrder = blocOrderList.get(blocOrderList.size() - 1);
        assertThat(testBlocOrder.getStart()).isEqualTo(UPDATED_START);
    }

    @Test
    @Transactional
    void patchNonExistingBlocOrder() throws Exception {
        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();
        blocOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blocOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blocOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlocOrder() throws Exception {
        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();
        blocOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blocOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlocOrder() throws Exception {
        int databaseSizeBeforeUpdate = blocOrderRepository.findAll().size();
        blocOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocOrderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(blocOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlocOrder in the database
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlocOrder() throws Exception {
        // Initialize the database
        blocOrderRepository.saveAndFlush(blocOrder);

        int databaseSizeBeforeDelete = blocOrderRepository.findAll().size();

        // Delete the blocOrder
        restBlocOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, blocOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlocOrder> blocOrderList = blocOrderRepository.findAll();
        assertThat(blocOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
