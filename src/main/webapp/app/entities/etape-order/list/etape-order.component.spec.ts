import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EtapeOrderService } from '../service/etape-order.service';

import { EtapeOrderComponent } from './etape-order.component';

describe('EtapeOrder Management Component', () => {
  let comp: EtapeOrderComponent;
  let fixture: ComponentFixture<EtapeOrderComponent>;
  let service: EtapeOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EtapeOrderComponent],
    })
      .overrideTemplate(EtapeOrderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeOrderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EtapeOrderService);

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
    expect(comp.etapeOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
