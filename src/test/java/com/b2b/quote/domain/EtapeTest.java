package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtapeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Etape.class);
        Etape etape1 = new Etape();
        etape1.setId("id1");
        Etape etape2 = new Etape();
        etape2.setId(etape1.getId());
        assertThat(etape1).isEqualTo(etape2);
        etape2.setId("id2");
        assertThat(etape1).isNotEqualTo(etape2);
        etape1.setId(null);
        assertThat(etape1).isNotEqualTo(etape2);
    }
}
