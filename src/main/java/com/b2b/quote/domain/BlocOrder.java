package com.b2b.quote.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BlocOrder.
 */
@Entity
@Table(name = "bloc_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BlocOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start")
    private Boolean start;

    @JsonIgnoreProperties(value = { "blocDefinitions", "parcoursDefinition" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private EtapeDefinition etapeDefinition;

    @JsonIgnoreProperties(value = { "element", "etapeDefinition" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BlocDefinition current;

    @JsonIgnoreProperties(value = { "element", "etapeDefinition" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BlocDefinition next;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BlocOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getStart() {
        return this.start;
    }

    public BlocOrder start(Boolean start) {
        this.setStart(start);
        return this;
    }

    public void setStart(Boolean start) {
        this.start = start;
    }

    public EtapeDefinition getEtapeDefinition() {
        return this.etapeDefinition;
    }

    public void setEtapeDefinition(EtapeDefinition etapeDefinition) {
        this.etapeDefinition = etapeDefinition;
    }

    public BlocOrder etapeDefinition(EtapeDefinition etapeDefinition) {
        this.setEtapeDefinition(etapeDefinition);
        return this;
    }

    public BlocDefinition getCurrent() {
        return this.current;
    }

    public void setCurrent(BlocDefinition blocDefinition) {
        this.current = blocDefinition;
    }

    public BlocOrder current(BlocDefinition blocDefinition) {
        this.setCurrent(blocDefinition);
        return this;
    }

    public BlocDefinition getNext() {
        return this.next;
    }

    public void setNext(BlocDefinition blocDefinition) {
        this.next = blocDefinition;
    }

    public BlocOrder next(BlocDefinition blocDefinition) {
        this.setNext(blocDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BlocOrder)) {
            return false;
        }
        return id != null && id.equals(((BlocOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BlocOrder{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            "}";
    }
}
