// Validação dos dados com Zod. Cada schema descreve o que é aceito em um formulário.

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.'),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  phone: z.string().trim().min(8, 'Informe um telefone válido.'),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres.'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.'),
  phone: z.string().trim().min(8, 'Informe um telefone válido.'),
});

export const petSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do animal.'),
  species: z.string().trim().min(1, 'Informe a espécie.'),
  breed: z.string().trim(),
  birthDate: z.string(),
  weight: z.coerce.number({ invalid_type_error: 'Peso inválido.' }).min(0, 'Peso inválido.').max(200, 'Peso inválido.'),
  observations: z.string().trim(),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do serviço.'),
  description: z.string().trim(),
  price: z.coerce.number({ invalid_type_error: 'Preço inválido.' }).min(0, 'Preço inválido.'),
  duration: z.coerce
    .number({ invalid_type_error: 'Duração inválida.' })
    .int('A duração deve ser em minutos inteiros.')
    .min(5, 'A duração mínima é de 5 minutos.')
    .max(480, 'A duração máxima é de 480 minutos.'),
  active: z.boolean(),
});

export const appointmentSchema = z.object({
  petId: z.string().min(1, 'Selecione um animal.'),
  serviceId: z.string().min(1, 'Selecione um serviço.'),
  date: z.string().min(1, 'Escolha data e horário.'),
  notes: z.string().trim(),
});

export const consultationSchema = z.object({
  petId: z.string().min(1, 'Selecione um animal.'),
  appointmentId: z.string().optional(),
  veterinarian: z.string().trim().min(2, 'Informe o veterinário.'),
  diagnosis: z.string().trim().min(2, 'Informe o diagnóstico.'),
  notes: z.string().trim(),
  date: z.string().min(1, 'Informe a data da consulta.'),
});

// Tipos das entradas (o que os formulários enviam).
export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}
export interface ProfileInput {
  name: string;
  phone: string;
}
export interface PetInput {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: string | number;
  observations: string;
}
export interface ServiceInput {
  name: string;
  description: string;
  price: string | number;
  duration: string | number;
  active: boolean;
}
export interface AppointmentInput {
  petId: string;
  serviceId: string;
  date: string;
  notes: string;
}
export interface ConsultationInput {
  petId: string;
  appointmentId?: string;
  veterinarian: string;
  diagnosis: string;
  notes: string;
  date: string;
}
