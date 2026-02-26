import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { DataSource } from "typeorm";
import type { HealthCheckResponse } from "@fuel-me/shared-types";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ operationId: "healthCheck", summary: "Health check" })
  async check(): Promise<HealthCheckResponse> {
    let connected = false;
    try {
      await this.dataSource.query("SELECT 1");
      connected = true;
    } catch {
      connected = false;
    }

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: { connected },
    };
  }
}
