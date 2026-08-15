import { describe, it, expect } from 'vitest';
import {
  validateAssetFormStep,
  normalizeAssetFormPayload,
  formatAssetFormLabel
} from './assetFormValidation';

const validStep1 = {
  assetTag: 'LAP-2026-001',
  name: 'Dell Laptop',
  category: 'Laptop',
  serialNumber: 'SN-123'
};

const validStep2 = {
  location: 'HQ Floor 1',
  status: 'AVAILABLE',
  assignedTo: ''
};

describe('validateAssetFormStep', () => {
  it('flags required identity fields on step 1', () => {
    const errors = validateAssetFormStep(
      { assetTag: '', name: '', category: '', serialNumber: '' },
      1
    );

    expect(errors.assetTag).toBe('Asset tag is required.');
    expect(errors.name).toBe('Asset name is required.');
    expect(errors.category).toBe('Category is required.');
    expect(errors.serialNumber).toBe('Serial number is required.');
  });

  it('returns no errors when step 1 is valid', () => {
    const errors = validateAssetFormStep(validStep1, 1);

    expect(errors).toEqual({});
  });

  it('returns no errors when step 2 is valid', () => {
    const errors = validateAssetFormStep(validStep2, 2);

    expect(errors).toEqual({});
  });
});

describe('normalizeAssetFormPayload', () => {
  it('trims required fields and nulls a blank assignee', () => {
    const payload = normalizeAssetFormPayload({
      assetTag: '  LAP-2026-001  ',
      name: '  Dell Laptop  ',
      category: '  Laptop  ',
      serialNumber: '  SN-123  ',
      status: 'AVAILABLE',
      location: '  HQ  ',
      assignedTo: '   '
    });

    expect(payload).toEqual({
      assetTag: 'LAP-2026-001',
      name: 'Dell Laptop',
      category: 'Laptop',
      serialNumber: 'SN-123',
      status: 'AVAILABLE',
      location: 'HQ',
      assignedTo: null
    });
  });
});

describe('formatAssetFormLabel', () => {
  it('converts camelCase keys into spaced labels', () => {
    expect(formatAssetFormLabel('assetTag')).toBe('Asset Tag');
    expect(formatAssetFormLabel('assignedTo')).toBe('Assigned To');
  });
});
