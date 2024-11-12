import { MigrationInterface, QueryRunner } from "typeorm";

export class File1731434784976 implements MigrationInterface {
    name = 'File1731434784976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`alert\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chain\` varchar(255) NOT NULL, \`target_price\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`is_triggered\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`prices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chain\` varchar(255) NOT NULL, \`symbol\` varchar(255) NOT NULL, \`price\` decimal(18,8) NOT NULL, \`percent_change_1h\` decimal(18,8) NOT NULL, \`percent_change_24h\` decimal(18,8) NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_3128f9bc2566dfac8e357b5d38\` (\`chain\`, \`timestamp\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`swap\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ethAmount\` decimal(18,8) NOT NULL, \`btcAmount\` decimal(18,8) NULL, \`feeInEth\` decimal(18,8) NULL, \`feeInUsd\` decimal(18,8) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`swap\``);
        await queryRunner.query(`DROP INDEX \`IDX_3128f9bc2566dfac8e357b5d38\` ON \`prices\``);
        await queryRunner.query(`DROP TABLE \`prices\``);
        await queryRunner.query(`DROP TABLE \`alert\``);
    }

}
