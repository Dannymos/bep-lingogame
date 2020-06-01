import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../src/modules/HealthModule/controllers/HealthController';
import { HealthService } from '../src/modules/HealthModule/services/HealthService';

describe('HealthController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();
  });

  describe('getHealth', () => {
    it('should return "Healthy!"', () => {
      const appController = app.get<HealthController>(HealthController);
      expect(appController.getHealth()).toBe('Healthy!');
    });
  });
});
