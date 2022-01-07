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
 * A Etape.
 */
@Entity
@Table(name = "etape")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Etape implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "etape")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "etape" }, allowSetters = true)
    private Set<Bloc> blocs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "etapes", "offres", "parcours", "parent" }, allowSetters = true)
    private Parcours parcours;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etape id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Etape name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Bloc> getBlocs() {
        return this.blocs;
    }

    public void setBlocs(Set<Bloc> blocs) {
        if (this.blocs != null) {
            this.blocs.forEach(i -> i.setEtape(null));
        }
        if (blocs != null) {
            blocs.forEach(i -> i.setEtape(this));
        }
        this.blocs = blocs;
    }

    public Etape blocs(Set<Bloc> blocs) {
        this.setBlocs(blocs);
        return this;
    }

    public Etape addBloc(Bloc bloc) {
        this.blocs.add(bloc);
        bloc.setEtape(this);
        return this;
    }

    public Etape removeBloc(Bloc bloc) {
        this.blocs.remove(bloc);
        bloc.setEtape(null);
        return this;
    }

    public Parcours getParcours() {
        return this.parcours;
    }

    public void setParcours(Parcours parcours) {
        this.parcours = parcours;
    }

    public Etape parcours(Parcours parcours) {
        this.setParcours(parcours);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etape)) {
            return false;
        }
        return id != null && id.equals(((Etape) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etape{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
