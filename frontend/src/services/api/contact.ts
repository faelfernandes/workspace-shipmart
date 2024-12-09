import axios from 'axios'
import type { Contact } from '@/types/contact'
import type { PaginatedResponse } from '@/types/pagination'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
})

export const ContactService = {
  async getAll(params: URLSearchParams) {
    const { data } = await api.get<PaginatedResponse<Contact>>(`/contacts?${params.toString()}`)
    return data
  },

  async getById(id: number) {
    const { data } = await api.get<Contact>(`/contacts/${id}`)
    return data
  },

  async create(contact: Omit<Contact, 'id'>) {
    const { data } = await api.post<Contact>('/contacts', {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: {
        zip_code: contact.address.zip_code,
        state: contact.address.state,
        city: contact.address.city,
        neighborhood: contact.address.neighborhood,
        street: contact.address.street,
        number: contact.address.number,
      },
    })
    return data
  },

  async update(id: number, contact: Partial<Contact>) {
    const { data } = await api.put<Contact>(`/contacts/${id}`, {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: {
        zip_code: contact.address?.zip_code,
        state: contact.address?.state,
        city: contact.address?.city,
        neighborhood: contact.address?.neighborhood,
        street: contact.address?.street,
        number: contact.address?.number,
      },
    })
    return data
  },

  async delete(id: number) {
    await api.delete(`/contacts/${id}`)
  },

  async exportToCsv(ids: number[]) {
    const { data } = await api.post(
      '/contacts/export',
      { contacts: ids },
      {
        responseType: 'blob',
      },
    )
    return data
  },
}
