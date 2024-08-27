import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "../entities/book.entity";
import { Like, Repository } from "typeorm";
import { BookCreateDto, QueryParamsDto } from "./dto/book.dto";
import { constant } from "../utils/constant";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookEntityRepo: Repository<BookEntity>,
  ) {}
  async create(payload: BookCreateDto) {
    const bookObject = {
      ...payload,
    };
    const bookCreated = await this.bookEntityRepo.save(bookObject);
    return {
      data: bookCreated,
      message: constant.BOOK_CREATE,
    };
  }

  async findAll(params: QueryParamsDto) {
    const { searchKeyword, page, limit } = params;
    let whereClause = {};
    if (searchKeyword) {
      whereClause = {
        name: Like(`%${searchKeyword}%`),
      };
    }
    const [books, totalCount] = await this.bookEntityRepo.findAndCount({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: books,
      total: totalCount,
      page,
      limit,
    };
  }

  async findOne(id) {
    const bookFound = await this.bookEntityRepo.findOne({
      where: {
        id,
      },
    });
    if (bookFound) {
      return { data: bookFound };
    }
    return {
      message: constant.BOOK_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  async update(id, payload) {
    const { name, description, price } = payload;
    const bookFound = await this.bookEntityRepo.findOne({
      where: {
        id,
      },
    });
    if (bookFound) {
      if (bookFound) {
        bookFound.name = name;
        bookFound.description = description;
        bookFound.price = price;

        const updateBook = await this.bookEntityRepo.save(bookFound);
        return {
          data: updateBook,
          message: constant.BOOK_UPDATED,
        };
      }
      return {
        data: bookFound,
        message: constant.BOOK_UPDATED,
      };
    }
    return {
      message: constant.BOOK_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  async remove(id) {
    const bookFound = await this.bookEntityRepo.findOne({
      where: {
        id,
      },
    });
    if (bookFound) {
      await this.bookEntityRepo.delete({
        id: bookFound?.id,
      });
      return {
        message: constant.BOOK_DELETED,
      };
    }
    return {
      message: constant.BOOK_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    };
  }
}
