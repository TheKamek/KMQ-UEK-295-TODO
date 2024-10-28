import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { TestController, User } from './test.controller';
import { TestService } from './test.service';

describe('TestController', () => {
  let testController: TestController;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        TestService,
        {
          provide: getRepositoryToken(TestEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    testController = module.get<TestController>(TestController);
    testService = module.get<TestService>(TestService);
  });

  it('controller should be defined', () => {
    expect(testController).toBeDefined();
  });

  describe('Tests um ein Objekt zu finden', () => {
    it('positiv: soll einen gültigen eintrag zurückgeben', async () => {
      const id = 1;
      const result = { id, name: 'Test Todo' };
      // wir mocken hier den Aufruf des Service und geben entsprechend ein aufgelöstes Promise zurück. Wir "Spionieren" auf dem Service und ersetzen den echten Aufruf mit diesem Wert
      jest.spyOn(testService, 'findOneTest').mockImplementation(() => Promise.resolve(result));
      // wir testen und erwarten ein gültiges Objekt
      expect(await testController.findOne(id)).toBe(result);
      // Sicherstellen, dass die findOneTest Methode aufgerufen wurde
      expect(testService.findOneTest).toHaveBeenCalled();
    });

    it('negative: soll einen Fehler zurückgeben, wenn ein Objekt nicht in der Datenbank gefunden wird', async () => {
      const id = 1;
      // wir mocken hier den Aufruf des Service und geben entsprechend ein reject promise mit dem Fehler zurück
      jest
        .spyOn(testService, 'findOneTest')
        .mockImplementation(() =>
          Promise.reject(new NotFoundException(`Es wurde kein Benutzer mit der id ${id} gefunden!`)),
        );
      try {
        await testController.findOne(id);
      } catch (err) {
        // wir prüfen, ob der richtige Fehlertyp und die Fehlermeldung stimmt
        expect(err).toEqual(new NotFoundException(`Es wurde kein Benutzer mit der id ${id} gefunden!`));
        // Sicherstellen, dass die findOneTest Methode aufgerufen wurde
        expect(testService.findOneTest).toHaveBeenCalled();
      }
    });
  });

  describe('delete', () => {
    it('positiv: sollte löschen und den gelöschten Datensatz zurückgeben. Dieser Test geht auch, wenn der Service diese Methode gar noch nicht kennt, da wir ja gar noch nicht den Service aufrufen', async () => {
      const result = { id: 1, name: 'Test Todo' };
      // definiere den Benutzer, welcher die Methode aufruft
      const adminUser: User = { name: 'Admin', roles: ['admin'] };
      // delete aufrufen
      jest.spyOn(testService, 'delete').mockImplementation(() => Promise.resolve(result));
      expect(await testController.delete(1, adminUser)).toBe(result);
      // Sicherstellen, dass die findOneTest Methode aufgerufen wurde
      expect(testService.delete).toHaveBeenCalled();
    });

    it('negativ: Sollte einen Fehler zurückgeben wenn der Benutzer kein admin ist', async () => {
      // definiere den Benutzer, welcher die Methode aufruft
      const nonAdminUser: User = { name: 'User', roles: ['user'] };
      try {
        // wir rufen jetzt die delete-Methode auf dem controller auf. Wir erwarten, dass ein Fehler geworfen wird!
        await testController.delete(1, nonAdminUser);
      } catch (err) {
        // wir prüfen, ob der richtige Fehlertyp und die Fehlermeldung stimmt
        expect(err).toEqual(
          new UnauthorizedException(`User ist nicht in der richtigen Rolle. Es wird die Rolle Administrator erwartet`),
        );
      }
    });
  });
});
