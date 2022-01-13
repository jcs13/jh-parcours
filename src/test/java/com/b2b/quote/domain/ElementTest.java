package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Element.class);
        Element element1 = new Element();
        element1.setId("id1");
        Element element2 = new Element();
        element2.setId(element1.getId());
        assertThat(element1).isEqualTo(element2);
        element2.setId("id2");
        assertThat(element1).isNotEqualTo(element2);
        element1.setId(null);
        assertThat(element1).isNotEqualTo(element2);
    }
}
