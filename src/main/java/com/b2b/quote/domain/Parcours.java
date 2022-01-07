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
 * A Parcours.
 */
@Entity
@Table(name = "parcours")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Parcours implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "parcours")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blocs", "parcours" }, allowSetters = true)
    private Set<Etape> etapes = new HashSet<>();

    @OneToMany(mappedBy = "parcours")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parcours" }, allowSetters = true)
    private Set<Offre> offres = new HashSet<>();

    @OneToMany(mappedBy = "parent")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "etapes", "offres", "parcours", "parent" }, allowSetters = true)
    private Set<Parcours> parcours = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "etapes", "offres", "parcours", "parent" }, allowSetters = true)
    private Parcours parent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parcours id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Parcours name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Etape> getEtapes() {
        return this.etapes;
    }

    public void setEtapes(Set<Etape> etapes) {
        if (this.etapes != null) {
            this.etapes.forEach(i -> i.setParcours(null));
        }
        if (etapes != null) {
            etapes.forEach(i -> i.setParcours(this));
        }
        this.etapes = etapes;
    }

    public Parcours etapes(Set<Etape> etapes) {
        this.setEtapes(etapes);
        return this;
    }

    public Parcours addEtape(Etape etape) {
        this.etapes.add(etape);
        etape.setParcours(this);
        return this;
    }

    public Parcours removeEtape(Etape etape) {
        this.etapes.remove(etape);
        etape.setParcours(null);
        return this;
    }

    public Set<Offre> getOffres() {
        return this.offres;
    }

    public void setOffres(Set<Offre> offres) {
        if (this.offres != null) {
            this.offres.forEach(i -> i.setParcours(null));
        }
        if (offres != null) {
            offres.forEach(i -> i.setParcours(this));
        }
        this.offres = offres;
    }

    public Parcours offres(Set<Offre> offres) {
        this.setOffres(offres);
        return this;
    }

    public Parcours addOffre(Offre offre) {
        this.offres.add(offre);
        offre.setParcours(this);
        return this;
    }

    public Parcours removeOffre(Offre offre) {
        this.offres.remove(offre);
        offre.setParcours(null);
        return this;
    }

    public Set<Parcours> getParcours() {
        return this.parcours;
    }

    public void setParcours(Set<Parcours> parcours) {
        if (this.parcours != null) {
            this.parcours.forEach(i -> i.setParent(null));
        }
        if (parcours != null) {
            parcours.forEach(i -> i.setParent(this));
        }
        this.parcours = parcours;
    }

    public Parcours parcours(Set<Parcours> parcours) {
        this.setParcours(parcours);
        return this;
    }

    public Parcours addParcours(Parcours parcours) {
        this.parcours.add(parcours);
        parcours.setParent(this);
        return this;
    }

    public Parcours removeParcours(Parcours parcours) {
        this.parcours.remove(parcours);
        parcours.setParent(null);
        return this;
    }

    public Parcours getParent() {
        return this.parent;
    }

    public void setParent(Parcours parcours) {
        this.parent = parcours;
    }

    public Parcours parent(Parcours parcours) {
        this.setParent(parcours);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parcours)) {
            return false;
        }
        return id != null && id.equals(((Parcours) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parcours{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
