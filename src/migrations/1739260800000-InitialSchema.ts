import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialSchema1739260800000 implements MigrationInterface {
  name = 'InitialSchema1739260800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'portfolios',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '120',
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'char',
            length: '36',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'dob',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'skills',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'is_public',
            type: 'tinyint',
            width: 1,
            default: 1,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    const portfoliosTable = await queryRunner.getTable('portfolios');
    const hasPortfoliosUserFk = portfoliosTable?.foreignKeys.some(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    if (!hasPortfoliosUserFk) {
      await queryRunner.createForeignKey(
        'portfolios',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const hasPortfoliosUserIdIndex = portfoliosTable?.indices.some(
      (i) => i.columnNames.indexOf('user_id') !== -1 && i.isUnique,
    );
    if (!hasPortfoliosUserIdIndex) {
      await queryRunner.createIndex(
        'portfolios',
        new TableIndex({
          name: 'UQ_portfolios_user_id',
          columnNames: ['user_id'],
          isUnique: true,
        }),
      );
    }

    await queryRunner.createTable(
      new Table({
        name: 'portfolio_detail',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'portfolio_id',
            type: 'char',
            length: '36',
          },
          {
            name: 'locale',
            type: 'enum',
            enum: ['en', 'vi'],
          },
          {
            name: 'nav',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'hero',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'profile',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'about',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'skills',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'experience',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'experiences',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'education',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'contact',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'footer',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    const portfolioDetailTable = await queryRunner.getTable('portfolio_detail');
    const hasPortfolioDetailFk = portfolioDetailTable?.foreignKeys.some(
      (fk) => fk.columnNames.indexOf('portfolio_id') !== -1,
    );
    if (!hasPortfolioDetailFk) {
      await queryRunner.createForeignKey(
        'portfolio_detail',
        new TableForeignKey({
          columnNames: ['portfolio_id'],
          referencedTableName: 'portfolios',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const hasPortfolioDetailUniqueIndex = portfolioDetailTable?.indices.some(
      (i) => i.columnNames.indexOf('portfolio_id') !== -1 && i.isUnique,
    );
    if (!hasPortfolioDetailUniqueIndex) {
      await queryRunner.createIndex(
        'portfolio_detail',
        new TableIndex({
          name: 'UQ_portfolio_detail_portfolio_id_locale',
          columnNames: ['portfolio_id', 'locale'],
          isUnique: true,
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const portfolioDetailTable = await queryRunner.getTable('portfolio_detail');
    const portfolioDetailFk = portfolioDetailTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('portfolio_id') !== -1,
    );
    if (portfolioDetailFk) {
      await queryRunner.dropForeignKey('portfolio_detail', portfolioDetailFk);
    }
    const portfolioDetailUniqueIndex = portfolioDetailTable?.indices.find(
      (i) => i.columnNames.indexOf('portfolio_id') !== -1 && i.isUnique,
    );
    if (portfolioDetailUniqueIndex) {
      await queryRunner.dropIndex('portfolio_detail', portfolioDetailUniqueIndex);
    }
    await queryRunner.dropTable('portfolio_detail', true);

    const portfoliosTable = await queryRunner.getTable('portfolios');
    const portfoliosUniqueIndex = portfoliosTable?.indices.find(
      (i) => i.columnNames.indexOf('user_id') !== -1 && i.isUnique,
    );
    if (portfoliosUniqueIndex) {
      await queryRunner.dropIndex('portfolios', portfoliosUniqueIndex);
    }
    const portfoliosFk = portfoliosTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    if (portfoliosFk) {
      await queryRunner.dropForeignKey('portfolios', portfoliosFk);
    }
    await queryRunner.dropTable('portfolios', true);

    await queryRunner.dropTable('users', true);
  }
}
