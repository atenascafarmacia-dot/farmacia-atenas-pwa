import {
  type AddressDto,
  addressRepository,
  type AddressWriteData,
} from "@/repositories/address.repo";
import type { AddressInput } from "@/schemas/address.schema";

export type { AddressDto };

/** Returns the saved addresses for a user (most recent first). */
export async function getUserAddresses(userId: string): Promise<AddressDto[]> {
  return addressRepository.findByUser(userId);
}

/** Returns a single address owned by the user, or null. */
export async function getUserAddress(id: string, userId: string): Promise<AddressDto | null> {
  return addressRepository.findByIdForUser(id, userId);
}

/** Normalizes validated form input into persistable data (empty → null). */
function toWriteData(input: AddressInput): AddressWriteData {
  const label = input.label?.trim();
  const zipCode = input.zipCode?.trim();
  return {
    label: label ? label : null,
    address: input.address,
    city: input.city,
    state: input.state,
    zipCode: zipCode ? zipCode : null,
  };
}

export async function createAddress(userId: string, input: AddressInput): Promise<AddressDto> {
  return addressRepository.create(userId, toWriteData(input));
}

/** Updates an address; returns false when it doesn't belong to the user. */
export async function updateAddress(
  id: string,
  userId: string,
  input: AddressInput,
): Promise<boolean> {
  const count = await addressRepository.update(id, userId, toWriteData(input));
  return count > 0;
}

/** Deletes an address; returns false when it doesn't belong to the user. */
export async function deleteAddress(id: string, userId: string): Promise<boolean> {
  const count = await addressRepository.delete(id, userId);
  return count > 0;
}
