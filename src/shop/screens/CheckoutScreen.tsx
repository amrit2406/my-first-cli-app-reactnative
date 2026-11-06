import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Control, Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '../CartContext';
import { useOrders } from '../OrdersContext';
import {
  CheckoutForm,
  checkoutSchema,
  PAYMENT_METHODS,
  PaymentMethod,
} from '../checkoutSchema';
import { RootStackParamList } from '../types';
import { Colors, useStyles } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Cash on delivery',
  upi: 'UPI',
  card: 'Card',
};

// Every field except the payment selector is a text field.
type TextField = Exclude<keyof CheckoutForm, 'paymentMethod'>;

// LESSON: a reusable form field.
// <Controller> connects any custom input to react-hook-form. It hands us
// `field` (value + handlers) and `fieldState` (error info).
function Field({
  control,
  name,
  label,
  ...inputProps
}: { control: Control<CheckoutForm>; name: TextField; label: string } & TextInputProps) {
  const { styles, colors } = useStyles(makeStyles);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            {...inputProps}
            style={[styles.input, fieldState.error && styles.inputError]}
            placeholderTextColor={colors.textFaint}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
          {fieldState.error && (
            <Text style={styles.error}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

export default function CheckoutScreen({ navigation }: Props) {
  const { styles } = useStyles(makeStyles);
  const { items, totalPrice, clear } = useCart();
  const { placeOrder } = useOrders();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema), // zod does the validating
    mode: 'onTouched', // validate a field after the user leaves it
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      paymentMethod: 'cod',
      upiId: '',
      cardNumber: '',
      cardExpiry: '',
    },
  });

  // useWatch re-renders us when this one field changes, so we can show
  // or hide the UPI / card inputs.
  const method = useWatch({ control, name: 'paymentMethod' });

  // handleSubmit runs validation first. Our function below is only called
  // if every field is valid, and `data` is fully typed.
  const onSubmit = async (data: CheckoutForm) => {
    await new Promise<void>(resolve => setTimeout(resolve, 1200)); // fake payment

    placeOrder(items, totalPrice, {
      name: data.fullName,
      address: `${data.address}, ${data.city} - ${data.pincode}`,
      payment: PAYMENT_LABELS[data.paymentMethod],
    });
    clear();
    navigation.popToTop(); // back to the tabs
    Alert.alert('Order placed 🎉', 'Thank you! Find it under Profile → Order history.');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.section}>Delivery details</Text>
        <Field control={control} name="fullName" label="Full name" placeholder="Amrit Kumar" autoCapitalize="words" />
        <Field control={control} name="phone" label="Mobile number" placeholder="9876543210" keyboardType="number-pad" maxLength={10} />
        <Field control={control} name="address" label="Address" placeholder="House no, street, area" multiline />
        <View style={styles.row}>
          <View style={styles.flex}>
            <Field control={control} name="city" label="City" placeholder="Pune" autoCapitalize="words" />
          </View>
          <View style={styles.flex}>
            <Field control={control} name="pincode" label="Pincode" placeholder="411001" keyboardType="number-pad" maxLength={6} />
          </View>
        </View>

        <Text style={styles.section}>Payment</Text>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <View style={styles.methods}>
              {PAYMENT_METHODS.map(m => (
                <Pressable
                  key={m}
                  onPress={() => field.onChange(m)}
                  style={[styles.method, field.value === m && styles.methodActive]}
                >
                  <Text style={[styles.methodText, field.value === m && styles.methodTextActive]}>
                    {PAYMENT_LABELS[m]}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />

        {/* Conditional fields */}
        {method === 'upi' && (
          <Field control={control} name="upiId" label="UPI ID" placeholder="name@okbank" autoCapitalize="none" autoCorrect={false} />
        )}
        {method === 'card' && (
          <>
            <Field control={control} name="cardNumber" label="Card number" placeholder="1234 5678 9012 3456" keyboardType="number-pad" maxLength={19} />
            <Field control={control} name="cardExpiry" label="Expiry" placeholder="MM/YY" maxLength={5} />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total to pay</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Place order</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: c.background },
  content: { padding: 16, paddingBottom: 24 },
  emptyText: { textAlign: 'center', marginTop: 60, color: c.textFaint, fontSize: 16 },
  section: { fontSize: 18, fontWeight: 'bold', color: c.text, marginVertical: 12 },
  field: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 13, color: c.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: c.card,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: c.text,
  },
  inputError: { borderColor: c.danger },
  error: { color: c.danger, fontSize: 12, marginTop: 4 },
  methods: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  method: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: c.surface,
    alignItems: 'center',
  },
  methodActive: { backgroundColor: c.primary },
  methodText: { fontSize: 13, fontWeight: '600', color: c.textSubtle },
  methodTextActive: { color: c.onPrimary },
  footer: { backgroundColor: c.card, padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 16, color: c.textMuted },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: c.text },
  button: { backgroundColor: c.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: c.onPrimary, fontSize: 16, fontWeight: 'bold' },
});
