import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';

@Injectable()
export class TestService {
  constructor(@InjectRepository(TestEntity) private testRepository: Repository<TestEntity>) {}

  async findAllTests() {
    return this.testRepository.find();
  }

  async findOneTest(id: number) {
    const findUser = await this.testRepository.findOneBy({ id });
    if (!findUser) {
      throw new NotFoundException(`Es wurde kein Benutzer mit der id ${id} gefunden!`);
    }
    return findUser;
  }

  async delete(id: number) {
    // wichtig zu verstehen, der Fehler wird in der Methode findOneTest geworfen, wenn kein Benutzer vorhanden ist. Es braucht hier keine prüfung
    const findUser = await this.findOneTest(id);
    // wir löschen den Benutzer
    await this.testRepository.delete({ id });
    // wir geben den alten Benutzer zurück
    return findUser;
  }
}
