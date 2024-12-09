interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse> {
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido')
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
  const data = await response.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return data
}
