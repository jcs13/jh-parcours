package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OffreParcoursCompositionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OffreParcoursComposition.class);
        OffreParcoursComposition offreParcoursComposition1 = new OffreParcoursComposition();
        offreParcoursComposition1.setId(1L);
        OffreParcoursComposition offreParcoursComposition2 = new OffreParcoursComposition();
        offreParcoursComposition2.setId(offreParcoursComposition1.getId());
        assertThat(offreParcoursComposition1).isEqualTo(offreParcoursComposition2);
        offreParcoursComposition2.setId(2L);
        assertThat(offreParcoursComposition1).isNotEqualTo(offreParcoursComposition2);
        offreParcoursComposition1.setId(null);
        assertThat(offreParcoursComposition1).isNotEqualTo(offreParcoursComposition2);
    }
}
