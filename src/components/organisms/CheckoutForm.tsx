"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { createOrderAction } from "@/app/_actions/order.action";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Price } from "@/components/atoms/Price";
import { EmptyState } from "@/components/molecules/EmptyState";
import { DeliveryMethod, PaymentMethod } from "@/generated/prisma/enums";
import { strings } from "@/lib/strings";
import type { AddressDto } from "@/services/address.service";
import { selectCartTotal, useCartStore } from "@/store/cart";

interface CheckoutFormProps {
  addresses: AddressDto[];
}

const NEW_ADDRESS = "new";

export function CheckoutForm({ addresses }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore(selectCartTotal);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.RETIRO_TIENDA,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.EFECTIVO);
  const [notes, setNotes] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses[0]?.id ?? NEW_ADDRESS,
  );
  const [newAddress, setNewAddress] = useState({ address: "", city: "", state: "", zipCode: "" });
  const [saveAddress, setSaveAddress] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const c = strings.checkout;
  const isDelivery = deliveryMethod === DeliveryMethod.ENVIO_DOMICILIO;
  const usingNewAddress = selectedAddress === NEW_ADDRESS;

  const shipping = useMemo(() => {
    if (!isDelivery) return null;
    if (usingNewAddress) {
      return {
        shippingAddress: newAddress.address,
        shippingCity: newAddress.city,
        shippingState: newAddress.state,
        shippingZip: newAddress.zipCode,
      };
    }
    const picked = addresses.find((a) => a.id === selectedAddress);
    return {
      shippingAddress: picked?.address ?? "",
      shippingCity: picked?.city ?? "",
      shippingState: picked?.state ?? "",
      shippingZip: picked?.zipCode ?? "",
    };
  }, [isDelivery, usingNewAddress, newAddress, addresses, selectedAddress]);

  function handleSubmit() {
    setError(null);
    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      deliveryMethod,
      paymentMethod,
      notes,
      ...(shipping ?? {}),
      saveAddress: isDelivery && usingNewAddress && saveAddress,
    };
    startTransition(async () => {
      const result = await createOrderAction(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clear();
      router.push(`/pedido/${result.code}`);
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-7 w-7" strokeWidth={1.5} />}
        title={c.emptyCart}
        message={strings.cart.emptyHint}
        action={
          <Link href="/catalogo">
            <Button variant="outline">{strings.cart.goCatalog}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Delivery method */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold text-ink">{c.deliverySection}</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: DeliveryMethod.RETIRO_TIENDA, label: c.deliveryRetiro },
            { value: DeliveryMethod.ENVIO_DOMICILIO, label: c.deliveryEnvio },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-sm font-medium transition-colors ${
                deliveryMethod === option.value
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-border bg-card text-ink hover:bg-primary-50"
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={option.value}
                checked={deliveryMethod === option.value}
                onChange={() => setDeliveryMethod(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Shipping address — only for home delivery */}
      {isDelivery && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-semibold text-ink">{c.addressSection}</legend>

          {addresses.length > 0 && (
            <div className="flex flex-col gap-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm transition-colors ${
                    selectedAddress === a.id
                      ? "border-primary-600 bg-primary-50"
                      : "border-border bg-card"
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value={a.id}
                    checked={selectedAddress === a.id}
                    onChange={() => setSelectedAddress(a.id)}
                    className="mt-1"
                  />
                  <span className="text-ink">
                    {a.label && <span className="font-medium">{a.label} · </span>}
                    {a.address}, {a.city}, {a.state}
                    {a.zipCode ? ` (${a.zipCode})` : ""}
                  </span>
                </label>
              ))}
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-colors ${
                  usingNewAddress ? "border-primary-600 bg-primary-50" : "border-border bg-card"
                }`}
              >
                <input
                  type="radio"
                  name="savedAddress"
                  value={NEW_ADDRESS}
                  checked={usingNewAddress}
                  onChange={() => setSelectedAddress(NEW_ADDRESS)}
                />
                <span className="text-ink">{c.newAddress}</span>
              </label>
            </div>
          )}

          {usingNewAddress && (
            <div className="flex flex-col gap-3">
              <Input
                label={c.address}
                name="shippingAddress"
                placeholder={c.addressPlaceholder}
                value={newAddress.address}
                onChange={(e) => setNewAddress((s) => ({ ...s, address: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={c.city}
                  name="shippingCity"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress((s) => ({ ...s, city: e.target.value }))}
                />
                <Input
                  label={c.state}
                  name="shippingState"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress((s) => ({ ...s, state: e.target.value }))}
                />
              </div>
              <Input
                label={`${c.zipCode} (${c.zipOptional})`}
                name="shippingZip"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress((s) => ({ ...s, zipCode: e.target.value }))}
              />
              <label className="flex min-h-[44px] items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500"
                />
                {c.saveAddress}
              </label>
            </div>
          )}
        </fieldset>
      )}

      {/* Payment method */}
      <div className="flex flex-col gap-1">
        <label htmlFor="paymentMethod" className="text-sm font-semibold text-ink">
          {c.paymentSection}
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          className="min-h-[44px] w-full rounded-xl border border-border bg-card px-4 py-2.5 text-base text-ink focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {Object.values(PaymentMethod).map((method) => (
            <option key={method} value={method}>
              {strings.orders.paymentMethodLabel[method]}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-semibold text-ink">
          {c.notesSection}
        </label>
        <textarea
          id="notes"
          rows={3}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={c.notesPlaceholder}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-base text-ink placeholder:text-muted/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Summary + submit */}
      <div className="sticky bottom-[56px] -mx-4 border-t border-border bg-card px-4 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
          <span className="text-sm font-semibold text-ink">{c.total}</span>
          <Price amount={total} className="text-xl font-bold text-primary-700" />
        </div>
        {error && (
          <p role="alert" className="mb-3 text-sm text-danger">
            {error}
          </p>
        )}
        <Button className="w-full" size="lg" loading={isPending} onClick={handleSubmit}>
          {c.submit}
        </Button>
      </div>
    </div>
  );
}
