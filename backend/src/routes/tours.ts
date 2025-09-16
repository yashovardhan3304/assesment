import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { requireAuth, requireRole } from './auth';

export const toursRouter = Router();

const stepSchema = z.object({
  order: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  text: z.string().optional(),
  annotation: z.any().optional(),
});

const tourSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  steps: z.array(stepSchema).default([]),
});

// List my tours
toursRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const tours = await prisma.tour.findMany({ where: { ownerId: userId }, orderBy: { createdAt: 'desc' } });
  res.json(tours);
});

// Create tour
toursRouter.post('/', requireAuth, requireRole('user'), async (req: Request, res: Response) => {
  const parsed = tourSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const userId = (req as any).userId as string;
  const { title, description, isPublic, steps } = parsed.data;

  const tour = await prisma.tour.create({
    data: {
      title,
      description,
      isPublic: Boolean(isPublic),
      ownerId: userId,
      steps: { create: steps.map((s) => ({ ...s })) },
    },
    include: { steps: true },
  });
  res.status(201).json(tour);
});

// Get tour by id (must own)
toursRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const tour = await prisma.tour.findFirst({ where: { id: req.params.id, ownerId: userId }, include: { steps: true } });
  if (!tour) return res.status(404).json({ error: 'Not found' });
  res.json(tour);
});

// Update tour
toursRouter.put('/:id', requireAuth, requireRole('user'), async (req: Request, res: Response) => {
  const parsed = tourSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const userId = (req as any).userId as string;
  const existing = await prisma.tour.findFirst({ where: { id: req.params.id, ownerId: userId } });
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { steps, ...rest } = parsed.data;
  const updated = await prisma.$transaction(async (tx) => {
    const t = await tx.tour.update({ where: { id: existing.id }, data: rest });
    if (steps) {
      await tx.step.deleteMany({ where: { tourId: existing.id } });
      await tx.step.createMany({ data: steps.map((s) => ({ ...s, tourId: existing.id })) });
    }
    return tx.tour.findUnique({ where: { id: existing.id }, include: { steps: true } });
  });
  res.json(updated);
});

// Delete tour
toursRouter.delete('/:id', requireAuth, requireRole('user'), async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const existing = await prisma.tour.findFirst({ where: { id: req.params.id, ownerId: userId } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await prisma.tour.delete({ where: { id: existing.id } });
  res.status(204).send();
});

// Public view by shareId (no auth)
toursRouter.get('/public/share/:shareId', async (req: Request, res: Response) => {
  const tour = await prisma.tour.findFirst({ where: { shareId: req.params.shareId, isPublic: true }, include: { steps: true } });
  if (!tour) return res.status(404).json({ error: 'Not found' });
  res.json(tour);
});


