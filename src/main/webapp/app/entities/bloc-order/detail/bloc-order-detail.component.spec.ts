import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlocOrderDetailComponent } from './bloc-order-detail.component';

describe('BlocOrder Management Detail Component', () => {
  let comp: BlocOrderDetailComponent;
  let fixture: ComponentFixture<BlocOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlocOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ blocOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlocOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlocOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load blocOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.blocOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
