package com.b2b.quote.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OffreParcoursComposition.
 */
@Entity
@Table(name = "offre_parcours_composition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OffreParcoursComposition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start")
    private Boolean start;

    @OneToOne
    @JoinColumn(unique = true)
    private Offre offre;

    @JsonIgnoreProperties(value = { "etapeDefinitions" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ParcoursDefinition parcoursParent;

    @JsonIgnoreProperties(value = { "etapeDefinitions" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ParcoursDefinition parcoursChild;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OffreParcoursComposition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getStart() {
        return this.start;
    }

    public OffreParcoursComposition start(Boolean start) {
        this.setStart(start);
        return this;
    }

    public void setStart(Boolean start) {
        this.start = start;
    }

    public Offre getOffre() {
        return this.offre;
    }

    public void setOffre(Offre offre) {
        this.offre = offre;
    }

    public OffreParcoursComposition offre(Offre offre) {
        this.setOffre(offre);
        return this;
    }

    public ParcoursDefinition getParcoursParent() {
        return this.parcoursParent;
    }

    public void setParcoursParent(ParcoursDefinition parcoursDefinition) {
        this.parcoursParent = parcoursDefinition;
    }

    public OffreParcoursComposition parcoursParent(ParcoursDefinition parcoursDefinition) {
        this.setParcoursParent(parcoursDefinition);
        return this;
    }

    public ParcoursDefinition getParcoursChild() {
        return this.parcoursChild;
    }

    public void setParcoursChild(ParcoursDefinition parcoursDefinition) {
        this.parcoursChild = parcoursDefinition;
    }

    public OffreParcoursComposition parcoursChild(ParcoursDefinition parcoursDefinition) {
        this.setParcoursChild(parcoursDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OffreParcoursComposition)) {
            return false;
        }
        return id != null && id.equals(((OffreParcoursComposition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OffreParcoursComposition{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            "}";
    }
}
