import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

// Create test app (similar to main app)
const createTestApp = () => {
  const app = express()
  
  // Middleware
  app.use(helmet())
  app.use(cors())
  app.use(compression())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
  })
  
  // API routes
  app.get('/api', (req, res) => {
    res.json({ message: 'Task Tiles API v1.0.0' })
  })
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' })
  })
  
  return app
}

describe('Backend API Tests', () => {
  let app: express.Application
  
  beforeAll(() => {
    app = createTestApp()
  })
  
  describe('Health Check', () => {
    it('should return OK status', async () => {
      const response = await request(app).get('/health')
      
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('OK')
      expect(response.body.timestamp).toBeDefined()
    })
  })
  
  describe('API Endpoint', () => {
    it('should return API version', async () => {
      const response = await request(app).get('/api')
      
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Task Tiles API v1.0.0')
    })
  })
  
  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route')
      
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Route not found')
    })
  })
}) 