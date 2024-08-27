import { MigrationInterface, QueryRunner } from "typeorm";

export class File1724784490093 implements MigrationInterface {
  name = "File1724784490093";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`auther\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`books\` ADD \`auther\` varchar(255) NOT NULL`,
    );
  }
}
