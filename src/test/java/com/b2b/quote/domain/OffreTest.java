package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OffreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Offre.class);
        Offre offre1 = new Offre();
        offre1.setId(1L);
        Offre offre2 = new Offre();
        offre2.setId(offre1.getId());
        assertThat(offre1).isEqualTo(offre2);
        offre2.setId(2L);
        assertThat(offre1).isNotEqualTo(offre2);
        offre1.setId(null);
        assertThat(offre1).isNotEqualTo(offre2);
    }
}
