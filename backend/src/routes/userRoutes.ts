import { Router } from 'express';
import { prisma } from '../utils/database';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/users - 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: users,
      message: 'Users retrieved successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch users',
    };
    res.status(500).json(response);
  }
});

// GET /api/users/:id - 获取特定用户
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User retrieved successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch user',
    };
    res.status(500).json(response);
  }
});

export default router;
