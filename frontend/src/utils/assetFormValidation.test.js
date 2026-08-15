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

  it('rejects an asset tag that is not uppercase/number/hyphen', () => {
    const errors = validateAssetFormStep({ ...validStep1, assetTag: 'lap 001' }, 1);

    expect(errors.assetTag).toBe('Use uppercase letters, numbers and hyphens only.');
  });

  it('rejects an asset name shorter than 3 characters', () => {
    const errors = validateAssetFormStep({ ...validStep1, name: 'PC' }, 1);

    expect(errors.name).toBe('Asset name must be at least 3 characters.');
  });

  it('rejects an unknown status on step 2', () => {
    const errors = validateAssetFormStep({ ...validStep2, status: 'BROKEN' }, 2);

    expect(errors.status).toBe('Choose a valid status.');
  });

  it('rejects an assigned user that is not email-like, but accepts one with @', () => {
    const invalid = validateAssetFormStep({ ...validStep2, assignedTo: 'alice' }, 2);
    expect(invalid.assignedTo).toBe('Assigned user should look like an email address.');

    const valid = validateAssetFormStep({ ...validStep2, assignedTo: 'alice@example.com' }, 2);
    expect(valid.assignedTo).toBeUndefined();
  });

  it('requires the review confirmation on step 3', () => {
    const unconfirmed = validateAssetFormStep({}, 3, false);
    expect(unconfirmed.review).toBe('Please confirm that you reviewed the asset details.');

    const confirmed = validateAssetFormStep({}, 3, true);
    expect(confirmed).toEqual({});
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

  it('trims and keeps a real assignee', () => {
    const payload = normalizeAssetFormPayload({
      assetTag: 'LAP-2026-001',
      name: 'Dell Laptop',
      category: 'Laptop',
      serialNumber: 'SN-123',
      status: 'ASSIGNED',
      location: 'HQ',
      assignedTo: '  alice@example.com  '
    });

    expect(payload.assignedTo).toBe('alice@example.com');
    expect(payload.status).toBe('ASSIGNED');
  });
});

describe('formatAssetFormLabel', () => {
  it('converts camelCase keys into spaced labels', () => {
    expect(formatAssetFormLabel('assetTag')).toBe('Asset Tag');
    expect(formatAssetFormLabel('assignedTo')).toBe('Assigned To');
  });
});
