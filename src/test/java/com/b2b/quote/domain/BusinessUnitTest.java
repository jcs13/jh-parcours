package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BusinessUnitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusinessUnit.class);
        BusinessUnit businessUnit1 = new BusinessUnit();
        businessUnit1.setId("id1");
        BusinessUnit businessUnit2 = new BusinessUnit();
        businessUnit2.setId(businessUnit1.getId());
        assertThat(businessUnit1).isEqualTo(businessUnit2);
        businessUnit2.setId("id2");
        assertThat(businessUnit1).isNotEqualTo(businessUnit2);
        businessUnit1.setId(null);
        assertThat(businessUnit1).isNotEqualTo(businessUnit2);
    }
}
