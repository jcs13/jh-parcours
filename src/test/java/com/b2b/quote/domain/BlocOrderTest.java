package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlocOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlocOrder.class);
        BlocOrder blocOrder1 = new BlocOrder();
        blocOrder1.setId(1L);
        BlocOrder blocOrder2 = new BlocOrder();
        blocOrder2.setId(blocOrder1.getId());
        assertThat(blocOrder1).isEqualTo(blocOrder2);
        blocOrder2.setId(2L);
        assertThat(blocOrder1).isNotEqualTo(blocOrder2);
        blocOrder1.setId(null);
        assertThat(blocOrder1).isNotEqualTo(blocOrder2);
    }
}
