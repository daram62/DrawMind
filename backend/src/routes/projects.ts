import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

/**
 * POST /api/projects
 * Create a new project
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, description, userId, metadata } = req.body;

    if (!title) {
      throw new ApiError(400, 'Title is required');
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        user: true,
        files: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...project,
        metadata: project.metadata ? JSON.parse(project.metadata) : null,
      },
    });
  })
);

/**
 * GET /api/projects
 * Get all projects with optional filtering
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, userId, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: true,
          files: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.project.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: projects.map((p) => ({
        ...p,
        metadata: p.metadata ? JSON.parse(p.metadata) : null,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  })
);

/**
 * GET /api/projects/:id
 * Get a single project by ID
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: true,
        files: true,
      },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    res.status(200).json({
      success: true,
      data: {
        ...project,
        metadata: project.metadata ? JSON.parse(project.metadata) : null,
      },
    });
  })
);

/**
 * PUT /api/projects/:id
 * Update a project
 */
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status, metadata } = req.body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new ApiError(404, 'Project not found');
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(metadata && { metadata: JSON.stringify(metadata) }),
      },
      include: {
        user: true,
        files: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        ...project,
        metadata: project.metadata ? JSON.parse(project.metadata) : null,
      },
    });
  })
);

/**
 * DELETE /api/projects/:id
 * Delete a project (soft delete by setting status to 'deleted')
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { hard } = req.query;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new ApiError(404, 'Project not found');
    }

    if (hard === 'true') {
      // Hard delete
      await prisma.project.delete({
        where: { id },
      });
    } else {
      // Soft delete
      await prisma.project.update({
        where: { id },
        data: { status: 'deleted' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  })
);

export default router;
