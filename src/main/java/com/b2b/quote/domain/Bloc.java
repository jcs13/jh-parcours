package com.b2b.quote.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bloc.
 */
@Entity
@Table(name = "bloc")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bloc implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "component_id", nullable = false)
    private String componentId;

    @ManyToOne
    @JsonIgnoreProperties(value = { "blocs", "parcours" }, allowSetters = true)
    private Etape etape;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bloc id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Bloc name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComponentId() {
        return this.componentId;
    }

    public Bloc componentId(String componentId) {
        this.setComponentId(componentId);
        return this;
    }

    public void setComponentId(String componentId) {
        this.componentId = componentId;
    }

    public Etape getEtape() {
        return this.etape;
    }

    public void setEtape(Etape etape) {
        this.etape = etape;
    }

    public Bloc etape(Etape etape) {
        this.setEtape(etape);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bloc)) {
            return false;
        }
        return id != null && id.equals(((Bloc) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bloc{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", componentId='" + getComponentId() + "'" +
            "}";
    }
}
