import { HealthService } from '../../src/modules/HealthModule/services/HealthService';

describe('HealthService', () => {
    let healthService: HealthService;

    beforeAll(async () => {
        healthService = new HealthService();
    });

    describe('getHealth', () => {
        it('should return "Healthy!"', () => {

            expect(healthService.getHealth()).toBe('Healthy!');
        });
    });
});
