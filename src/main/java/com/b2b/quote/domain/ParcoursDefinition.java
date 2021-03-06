package com.b2b.quote.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ParcoursDefinition.
 */
@Entity
@Table(name = "parcours_definition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ParcoursDefinition implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @OneToMany(mappedBy = "parcoursDefinition")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blocDefinitions", "parcoursDefinition" }, allowSetters = true)
    private Set<EtapeDefinition> etapeDefinitions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public ParcoursDefinition id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ParcoursDefinition name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public ParcoursDefinition label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Set<EtapeDefinition> getEtapeDefinitions() {
        return this.etapeDefinitions;
    }

    public void setEtapeDefinitions(Set<EtapeDefinition> etapeDefinitions) {
        if (this.etapeDefinitions != null) {
            this.etapeDefinitions.forEach(i -> i.setParcoursDefinition(null));
        }
        if (etapeDefinitions != null) {
            etapeDefinitions.forEach(i -> i.setParcoursDefinition(this));
        }
        this.etapeDefinitions = etapeDefinitions;
    }

    public ParcoursDefinition etapeDefinitions(Set<EtapeDefinition> etapeDefinitions) {
        this.setEtapeDefinitions(etapeDefinitions);
        return this;
    }

    public ParcoursDefinition addEtapeDefinition(EtapeDefinition etapeDefinition) {
        this.etapeDefinitions.add(etapeDefinition);
        etapeDefinition.setParcoursDefinition(this);
        return this;
    }

    public ParcoursDefinition removeEtapeDefinition(EtapeDefinition etapeDefinition) {
        this.etapeDefinitions.remove(etapeDefinition);
        etapeDefinition.setParcoursDefinition(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParcoursDefinition)) {
            return false;
        }
        return id != null && id.equals(((ParcoursDefinition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParcoursDefinition{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            "}";
    }
}
