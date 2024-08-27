import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksEntity } from '../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BooksEntity])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule { }
