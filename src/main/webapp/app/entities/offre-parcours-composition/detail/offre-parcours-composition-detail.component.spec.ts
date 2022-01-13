import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OffreParcoursCompositionDetailComponent } from './offre-parcours-composition-detail.component';

describe('OffreParcoursComposition Management Detail Component', () => {
  let comp: OffreParcoursCompositionDetailComponent;
  let fixture: ComponentFixture<OffreParcoursCompositionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffreParcoursCompositionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offreParcoursComposition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OffreParcoursCompositionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OffreParcoursCompositionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offreParcoursComposition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offreParcoursComposition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
