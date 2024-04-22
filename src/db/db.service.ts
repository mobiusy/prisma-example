import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'node:util';
import { exec as execCb } from 'node:child_process';
import os from 'os';
import path from 'node:path';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { SchemaMigrationResult } from './dto/db.dto';

@Injectable()
export class DbService {
  private readonly logger = new Logger(DbService.name);
  private readonly PG_SCHEMA = 'schema.prisma';
  private readonly DB_SOURCE = 'postgresql';
  private readonly DB_DEST = 'db-tmp';
  constructor() {}

  /**
   * Run schema migration
   * @returns
   */
  async migrateScheme(): Promise<SchemaMigrationResult> {
    const exec = promisify(execCb);
    // 检查`${__dirname}//db`目录是否存在，如果存在，则复制到脚本到`${process.cwd()}/db-tmp`目录下
    const souceDir = path.join(__dirname, this.DB_SOURCE);
    const distDir = path.join(process.cwd(), this.DB_DEST);
    try {
      if (existsSync(distDir)) {
        rmSync(distDir, { recursive: true });
      }

      if (existsSync(souceDir)) {
        this.copyDir(souceDir, distDir);
      } else {
        const message = `souceDir ${souceDir} not exists!`;
        this.logger.error(message);
        throw new Error(message);
      }
    } catch (error) {
      throw new Error(`copyDir error: ${error.message}`);
    }

    const schemaFile = path.join(distDir, this.PG_SCHEMA);

    try {
      const { stdout, stderr } = await exec(
        `prisma migrate deploy --schema=${schemaFile}`,
        {
          env: {
            ...process.env,
          },
        },
      );

      this.logger.log({
        message: 'db migrate deploly result:',
        stdout,
        stderr,
      });

      return {
        stdout: stdout.split(os.EOL),
        stderr: stderr.split(os.EOL),
      };
    } finally {
      // clean up
      if (existsSync(distDir)) {
        rmSync(distDir, { recursive: true });
      }
    }
  }

  private copyDir(src, dest) {
    mkdirSync(dest, { recursive: true });

    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  }
}
