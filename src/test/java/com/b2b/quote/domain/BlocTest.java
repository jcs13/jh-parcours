package com.b2b.quote.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.b2b.quote.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlocTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bloc.class);
        Bloc bloc1 = new Bloc();
        bloc1.setId("id1");
        Bloc bloc2 = new Bloc();
        bloc2.setId(bloc1.getId());
        assertThat(bloc1).isEqualTo(bloc2);
        bloc2.setId("id2");
        assertThat(bloc1).isNotEqualTo(bloc2);
        bloc1.setId(null);
        assertThat(bloc1).isNotEqualTo(bloc2);
    }
}
