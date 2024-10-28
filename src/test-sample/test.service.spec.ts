import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestService } from './test.service';
import { TestEntity } from './entities/test.entity';

// wir definieren einen MockType welchen wir später verwenden können um Rückgabewerte Wunschgemäss zu verändern
export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

describe('TestService', () => {
  let testService: TestService;
  let repositoryMock: MockType<Repository<TestEntity>>;

  beforeEach(async () => {
    // Ein Testmodul erstellen, in dem TestRepository gemockt wird
    const moduleRef = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: getRepositoryToken(TestEntity),
          useValue: {
            find: jest.fn((entity) => entity),
            findOneBy: jest.fn((entity) => entity),
            insert: jest.fn((entity) => entity),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
      ],
    }).compile();

    testService = moduleRef.get<TestService>(TestService);
    repositoryMock = moduleRef.get(getRepositoryToken(TestEntity));
  });

  it('Service should be defined', () => {
    expect(testService).toBeDefined();
  });

  describe('Alle Tests um ein Array von Test Objekte zu erhalten', () => {
    it('Positiv: Soll ein leeres Array zurückgeben', async () => {
      // wir teilen jetzt mit, dass die find-Methode einen erfolgreichen Wert zurückgeben soll, und zwar ein leeres Array
      repositoryMock.find.mockReturnValue([]);
      // wir rufen jetzt die findAllTests-Methode auf dem Service auf
      const tests = await testService.findAllTests();
      // wir prüfenden den Rückgabewert
      expect(tests).toEqual([]);
      // Sicherstellen, dass die find Methode aufgerufen wurde
      expect(repositoryMock.find).toHaveBeenCalled();
    });

    it('Positiv: Soll ein Array von Objekten zurückgeben. Inhalt 1 Element', async () => {
      // welcher Wert möchten wir zurückgeben
      const obj = { id: 1, name: 'Test Test' };
      // wir teilen jetzt mit, dass die find-Methode einen erfolgreichen Wert zurückgeben soll, und zwar ein Array mit dem definierten obj
      repositoryMock.find.mockReturnValue([obj]);
      // wir rufen jetzt die findAllTests-Methode auf dem Service auf
      const tests = await testService.findAllTests();
      // wir prüfenden den Rückgabewert
      expect(tests).toEqual([obj]);
      // Sicherstellen, dass die find Methode aufgerufen wurde
      expect(repositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('Alle Tests um ein Test Objekt zu erhalten', () => {
    it('Positiv: Soll ein gültiges Objekt zurückmelden', async () => {
      const id = 1;
      // welcher Wert möchten wir zurückgeben
      const obj = { id: id, name: 'Test Test' };
      // wir teilen jetzt mit, dass die findOneBy Methode einen erfolgreichen Wert zurückgeben und zwar das definiertes obj
      repositoryMock.findOneBy.mockReturnValue(obj);
      // wir rufen jetzt die fineOneTest-Methode auf dem Service auf
      const test = await testService.findOneTest(id);
      expect(test).toEqual({ id: id, name: 'Test Test' });
      // Sicherstellen, dass die findOneBy Methode aufgerufen wurde
      expect(repositoryMock.findOneBy).toHaveBeenCalled();
    });

    it('Negativ: Soll einen Fehler melden, wenn der Benutzer nicht gefunden wird', async () => {
      // wir setzen die id, welche wir später in der Fehlermeldung sehen möchten
      const id = 1;
      // Wir erstellen den erwarteten Rückgabewert beim Zugriff auf die Datenbank über die findIOneBy Methode. In unserem Fall soll nichts gefunden werden, also null
      repositoryMock.findOneBy.mockReturnValue(null);
      try {
        // wir rufen jetzt die fineOneTest-Methode auf dem Service auf. Wir erwarten, dass ein Fehler geworfen wird!
        await testService.findOneTest(id);
      } catch (err) {
        // wir prüfen, ob der richtige Fehlertyp und die Fehlermeldung stimmt
        expect(err).toEqual(new NotFoundException(`Es wurde kein Benutzer mit der id ${id} gefunden!`));
        // Sicherstellen, dass die findOneBy Methode aufgerufen wurde
        expect(repositoryMock.findOneBy).toHaveBeenCalled();
      }
    });
  });

  describe('Alle Tests um ein Test Objekt zu löschen', () => {
    it('Positiv: Soll ein Objekt löschen und das gelöschte zurückmelden', async () => {
      const id = 1;
      // welcher Wert möchten wir zurückgeben
      const obj = { id: id, name: 'Test Test' };
      // in der Löschmethode wird erst gesucht und dann gelöscht. deshalb zwei mockups
      // wir teilen jetzt mit, dass die findOneBy Methode einen erfolgreichen Wert zurückgeben und zwar das definiertes obj
      repositoryMock.findOneBy.mockReturnValue(obj);
      // wir löschen jetzt die Datei, der Rückgabewert wird ignoriert. Wenn er nicht ignoriert wird, muss er hier gesetzt werden
      repositoryMock.delete.mockReturnValue({});
      // wir rufen jetzt die fineOneTest-Methode auf dem Service auf
      const test = await testService.delete(id);
      expect(test).toEqual({ id: id, name: 'Test Test' });
      // Sicherstellen, dass die findOneBy Methode aufgerufen wurde
      expect(repositoryMock.findOneBy).toHaveBeenCalled();
      expect(repositoryMock.delete).toHaveBeenCalled();
    });

    it('Negativ: Soll einen Fehler melden, wenn der Benutzer nicht gefunden wird', async () => {
      // wir setzen die id, welche wir später in der Fehlermeldung sehen möchten
      const id = 1;
      // Wir erstellen den erwarteten Rückgabewert beim Zugriff auf die Datenbank über die findIOneBy Methode. In unserem Fall soll nichts gefunden werden, also null
      repositoryMock.findOneBy.mockReturnValue(null);
      try {
        // wir rufen jetzt die fineOneTest-Methode auf dem Service auf. Wir erwarten, dass ein Fehler geworfen wird!
        await testService.findOneTest(id);
      } catch (err) {
        // wir prüfen, ob der richtige Fehlertyp und die Fehlermeldung stimmt
        expect(err).toEqual(new NotFoundException(`Es wurde kein Benutzer mit der id ${id} gefunden!`));
        // Sicherstellen, dass die findOneBy Methode aufgerufen wurde
        expect(repositoryMock.findOneBy).toHaveBeenCalled();
      }
    });
  });
});
