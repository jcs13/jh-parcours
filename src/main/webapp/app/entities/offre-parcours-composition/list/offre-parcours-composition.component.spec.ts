import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OffreParcoursCompositionService } from '../service/offre-parcours-composition.service';

import { OffreParcoursCompositionComponent } from './offre-parcours-composition.component';

describe('OffreParcoursComposition Management Component', () => {
  let comp: OffreParcoursCompositionComponent;
  let fixture: ComponentFixture<OffreParcoursCompositionComponent>;
  let service: OffreParcoursCompositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OffreParcoursCompositionComponent],
    })
      .overrideTemplate(OffreParcoursCompositionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreParcoursCompositionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OffreParcoursCompositionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.offreParcoursCompositions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
