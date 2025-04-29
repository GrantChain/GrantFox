import type { Grant } from '../@types/grant.entity';

export const mockGrants: Grant[] = [
  {
    id: 'grant-1',
    grant_provider_id: 'provider-1',
    project_id: 'project-1',
    title: 'Climate Change Research Initiative',
    description: 'Funding for innovative research projects addressing climate change impacts and solutions.',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: 'grant-2',
    grant_provider_id: 'provider-2',
    project_id: 'project-2',
    title: 'Community Development Program',
    description: 'Support for local community development initiatives and infrastructure projects.',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01'),
  },
  {
    id: 'grant-3',
    grant_provider_id: 'provider-1',
    project_id: 'project-3',
    title: 'Educational Technology Innovation',
    description: 'Grants for developing and implementing new educational technologies in schools.',
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15'),
  },
  {
    id: 'grant-4',
    grant_provider_id: 'provider-3',
    title: 'Healthcare Access Initiative',
    description: 'Funding to improve healthcare access in underserved communities.',
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01'),
  },
  {
    id: 'grant-5',
    grant_provider_id: 'provider-2',
    project_id: 'project-4',
    title: 'Sustainable Agriculture Program',
    description: 'Support for sustainable farming practices and agricultural innovation.',
    created_at: new Date('2024-03-15'),
    updated_at: new Date('2024-03-15'),
  },
]; 