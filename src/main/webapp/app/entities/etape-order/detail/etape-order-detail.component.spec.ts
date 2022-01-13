import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EtapeOrderDetailComponent } from './etape-order-detail.component';

describe('EtapeOrder Management Detail Component', () => {
  let comp: EtapeOrderDetailComponent;
  let fixture: ComponentFixture<EtapeOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtapeOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ etapeOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EtapeOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EtapeOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etapeOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.etapeOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
