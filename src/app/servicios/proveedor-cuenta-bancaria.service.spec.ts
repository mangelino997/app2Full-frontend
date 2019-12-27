import { TestBed } from '@angular/core/testing';

import { ProveedorCuentaBancariaService } from './proveedor-cuenta-bancaria.service';

describe('ProveedorCuentaBancariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProveedorCuentaBancariaService = TestBed.get(ProveedorCuentaBancariaService);
    expect(service).toBeTruthy();
  });
});
