import type { Address } from './address'

export interface Contact {
  id?: number
  name: string
  email: string
  phone: string
  address: Address
}

export interface ContactFilters {
  searchTerm: string
  state: string
  city: string
  page: number
}
