import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HealthService {
	constructor(private readonly prisma: PrismaService) {}
	async check() {
		const result = await this.prisma.$queryRaw`SELECT 1`;

		return {
			status: 'ok',
			service: 'hackathon-backend',
			database: result,
		};
	}
}
