package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtapeOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtapeOrder.class);
        EtapeOrder etapeOrder1 = new EtapeOrder();
        etapeOrder1.setId(1L);
        EtapeOrder etapeOrder2 = new EtapeOrder();
        etapeOrder2.setId(etapeOrder1.getId());
        assertThat(etapeOrder1).isEqualTo(etapeOrder2);
        etapeOrder2.setId(2L);
        assertThat(etapeOrder1).isNotEqualTo(etapeOrder2);
        etapeOrder1.setId(null);
        assertThat(etapeOrder1).isNotEqualTo(etapeOrder2);
    }
}
