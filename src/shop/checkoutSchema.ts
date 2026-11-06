import { z } from 'zod';

// LESSON: SCHEMA VALIDATION (zod)
// Describe what valid data looks like ONCE. The same schema then:
//   1. validates the form and produces the error messages, and
//   2. gives you the TypeScript type (z.infer), so they can't drift apart.

export const PAYMENT_METHODS = ['cod', 'upi', 'card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    address: z.string().trim().min(8, 'Enter your full address'),
    city: z.string().trim().min(2, 'Enter your city'),
    pincode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    paymentMethod: z.enum(PAYMENT_METHODS),
    // Only required for some payment methods; checked in superRefine below.
    upiId: z.string().trim(),
    cardNumber: z.string().trim(),
    cardExpiry: z.string().trim(),
  })
  // CROSS-FIELD RULES: which fields matter depends on paymentMethod.
  .superRefine((data, ctx) => {
    if (data.paymentMethod === 'upi' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(data.upiId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['upiId'],
        message: 'Enter a valid UPI ID (name@bank)',
      });
    }

    if (data.paymentMethod === 'card') {
      if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
        ctx.addIssue({
          code: 'custom',
          path: ['cardNumber'],
          message: 'Card number must be 16 digits',
        });
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
        ctx.addIssue({
          code: 'custom',
          path: ['cardExpiry'],
          message: 'Use MM/YY',
        });
      }
    }
  });

export type CheckoutForm = z.infer<typeof checkoutSchema>;
