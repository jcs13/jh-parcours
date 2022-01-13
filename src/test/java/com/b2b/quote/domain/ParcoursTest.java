package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParcoursTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parcours.class);
        Parcours parcours1 = new Parcours();
        parcours1.setId("id1");
        Parcours parcours2 = new Parcours();
        parcours2.setId(parcours1.getId());
        assertThat(parcours1).isEqualTo(parcours2);
        parcours2.setId("id2");
        assertThat(parcours1).isNotEqualTo(parcours2);
        parcours1.setId(null);
        assertThat(parcours1).isNotEqualTo(parcours2);
    }
}
