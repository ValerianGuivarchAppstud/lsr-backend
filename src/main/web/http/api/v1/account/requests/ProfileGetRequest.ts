import { FastifyRequest } from 'fastify'

export type ProfileGetRequest = FastifyRequest<never>

export const ProfileGetRequestSchema = {
  description: 'ProfileGetRequest',
  tags: ['Account']
}
