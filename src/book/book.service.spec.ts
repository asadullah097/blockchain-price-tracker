import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "./book.service";
import { Repository } from "typeorm";
import { BookEntity } from "../entities/book.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { constant } from "../utils/constant";
import { HttpStatus } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BookCreateDto } from "./dto/book.dto";
import { validate } from "class-validator";

const mockbookRepository = {
  save: jest.fn().mockImplementation((bookObject) => ({
    ...bookObject,
  })),
  findOne: jest.fn().mockImplementation((options) => {
    // Simulate finding a book based on the provided options
    if (options.where.id === 1) {
      return {
        id: 1,
        name: "book 1",
      };
    }
    // Simulate not finding a book
    return undefined;
  }),
  delete: jest.fn().mockImplementation(() => ({ affected: 1 })),
};
describe("BookService", () => {
  let bookService: BookService;
  let bookRepository: Repository<BookEntity>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(BookEntity),
          useValue: mockbookRepository,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<BookEntity>>(
      getRepositoryToken(BookEntity),
    );
  });

  describe("BookCreateDto", () => {
    it("should succeed with valid inputs", async () => {
      // Arrange
      const dto = {
        name: "Test Book",
        description: "A test description",
        price: 15,
      };

      // Act
      const bookCreateDto = plainToInstance(BookCreateDto, dto);
      const errors = await validate(bookCreateDto);

      // Assert
      expect(errors.length).toBe(0);
    });

    it("should fail when name is missing", async () => {
      // Arrange
      const dto = {
        description: "A test description",
        price: 15,
      };

      // Act
      const bookCreateDto = plainToInstance(BookCreateDto, dto);
      const errors = await validate(bookCreateDto);
      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toEqual("name");
      expect(
        errors[0].constraints[Object.keys(errors[0].constraints)[0]],
      ).toEqual("name should not be empty");
    });

    it("should fail when description is missing", async () => {
      // Arrange
      const dto = {
        name: "Test Book",
        price: 15,
      };

      // Act
      const bookCreateDto = plainToInstance(BookCreateDto, dto);
      const errors = await validate(bookCreateDto);
      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors[0].constraints[Object.keys(errors[0].constraints)[0]],
      ).toEqual("description should not be empty");
    });

    it("should fail when price is not positive", async () => {
      // Arrange
      const dto = {
        name: "Test Book",
        description: "A test description",
        price: -5,
      };

      // Act
      const bookCreateDto = plainToInstance(BookCreateDto, dto);
      const errors = await validate(bookCreateDto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toEqual("price");
      expect(
        errors[0].constraints[Object.keys(errors[0].constraints)[0]],
      ).toEqual("price must be a positive number");
    });

    it("should fail when price is not a number", async () => {
      // Arrange
      const dto = {
        name: "Test Book",
        description: "A test description",
        price: "not a number",
      };

      // Act
      const bookCreateDto = plainToInstance(BookCreateDto, dto);
      const errors = await validate(bookCreateDto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toEqual("price");
      expect(
        errors[0].constraints[Object.keys(errors[0].constraints)[0]],
      ).toEqual("Price must be a valid number.");
    });
  });

  describe("findOne", () => {
    it("should return book details if found", async () => {
      // Arrange
      const bookId = 1;

      // Act
      const result = await bookService.findOne(bookId);

      // Assert
      expect(result).toEqual({
        data: {
          id: 1,
          name: "book 1",
        },
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });

    it("should return BOOK_NOT_FOUND message if the book is not found", async () => {
      // Arrange
      const bookId = 2;

      // Act
      const result = await bookService.findOne(bookId);

      // Assert
      expect(result).toEqual({
        message: constant.BOOK_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });
  });

  describe("delete", () => {
    it(`should delete the book and return  ${constant.BOOK_DELETED} message if the book is found`, async () => {
      // Arrange
      const bookId = 1;

      // Act
      const result = await bookService.remove(bookId);

      // Assert
      expect(result).toEqual({
        message: constant.BOOK_DELETED,
      });

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });

      expect(bookRepository.delete).toHaveBeenCalledWith({
        id: bookId,
      });
    });

    it(`should return ${constant.BOOK_NOT_FOUND} message if the book is not found`, async () => {
      // Arrange
      const bookId = 4;

      // Act
      const result = await bookService.remove(bookId);
      // Assert
      expect(result).toEqual({
        message: constant.BOOK_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });

      // Ensure that the repository's delete method was not called in this case
      expect(bookRepository.delete).not.toHaveBeenCalled();
    });
  });
});
