import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlocOrderService } from '../service/bloc-order.service';

import { BlocOrderComponent } from './bloc-order.component';

describe('BlocOrder Management Component', () => {
  let comp: BlocOrderComponent;
  let fixture: ComponentFixture<BlocOrderComponent>;
  let service: BlocOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlocOrderComponent],
    })
      .overrideTemplate(BlocOrderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocOrderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlocOrderService);

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
    expect(comp.blocOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
