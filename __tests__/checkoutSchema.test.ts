import { checkoutSchema } from '../src/shop/checkoutSchema';

const valid = {
  fullName: 'Amrit Kumar',
  phone: '9876543210',
  address: '12 MG Road, Camp',
  city: 'Pune',
  pincode: '411001',
  paymentMethod: 'cod' as const,
  upiId: '',
  cardNumber: '',
  cardExpiry: '',
};

// Helper: which field names failed validation?
const failedFields = (data: object) => {
  const result = checkoutSchema.safeParse(data);
  return result.success ? [] : result.error.issues.map(i => String(i.path[0]));
};

describe('checkoutSchema', () => {
  test('accepts a valid cash-on-delivery order', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  test('rejects a bad phone number and a bad pincode', () => {
    const fields = failedFields({ ...valid, phone: '12345', pincode: '41' });
    expect(fields).toContain('phone');
    expect(fields).toContain('pincode');
  });

  test('UPI id is only required when paying by UPI', () => {
    expect(failedFields({ ...valid, paymentMethod: 'cod', upiId: '' })).toEqual([]);
    expect(failedFields({ ...valid, paymentMethod: 'upi', upiId: '' })).toContain('upiId');
    expect(
      failedFields({ ...valid, paymentMethod: 'upi', upiId: 'amrit@okbank' }),
    ).toEqual([]);
  });

  test('card number and expiry are validated for card payments', () => {
    const bad = failedFields({
      ...valid,
      paymentMethod: 'card',
      cardNumber: '1234',
      cardExpiry: '13/99',
    });
    expect(bad).toEqual(expect.arrayContaining(['cardNumber', 'cardExpiry']));

    expect(
      failedFields({
        ...valid,
        paymentMethod: 'card',
        cardNumber: '1234 5678 9012 3456',
        cardExpiry: '08/29',
      }),
    ).toEqual([]);
  });
});
