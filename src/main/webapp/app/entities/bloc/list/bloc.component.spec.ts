import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlocService } from '../service/bloc.service';

import { BlocComponent } from './bloc.component';

describe('Bloc Management Component', () => {
  let comp: BlocComponent;
  let fixture: ComponentFixture<BlocComponent>;
  let service: BlocService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlocComponent],
    })
      .overrideTemplate(BlocComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlocService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
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
    expect(comp.blocs?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
