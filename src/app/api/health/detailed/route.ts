import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check frontend health
    const frontendHealth = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
    };

    // Check backend API health
    let backendHealth = { status: 'unknown', responseTime: 0 };
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
      const backendStartTime = Date.now();
      
      // Try to reach a simple backend endpoint
      const response = await axios.get(`${apiUrl}/health`, { timeout: 5000 });
      const backendResponseTime = Date.now() - backendStartTime;
      
      backendHealth = {
        status: response.status === 200 ? 'ok' : 'error',
        responseTime: backendResponseTime,
      };
    } catch (error) {
      backendHealth = {
        status: 'error',
        responseTime: Date.now() - startTime,
      };
    }

    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json({
      frontend: frontendHealth,
      backend: backendHealth,
      totalResponseTime,
      overall: backendHealth.status === 'ok' ? 'healthy' : 'degraded',
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
        overall: 'unhealthy',
      },
      { status: 500 }
    );
  }
}
