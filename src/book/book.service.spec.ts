import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "./book.service";
import { Like, Repository } from "typeorm";
import { BookEntity } from "../entities/book.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { constant } from "../utils/constant";
import { HttpStatus } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BookCreateDto, BookViewDto, QueryParamsDto } from "./dto/book.dto";
import { validate } from "class-validator";

describe("BookService", () => {
  let bookService: BookService;
  let bookRepository: Repository<BookEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(BookEntity),
          useValue: {
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<BookEntity>>(
      getRepositoryToken(BookEntity),
    );
  });

  describe("create", () => {
    it("should succeed with valid inputs", async () => {
      // Arrange
      const payload: any = {
        name: "Test Book",
        description: "A test description",
        price: 15,
      };
      const mockResponse: any = {
        data: {
          ...payload,
        },
        message: constant.BOOK_CREATE,
      };

      const bookCreateDto: any = plainToInstance(BookCreateDto, payload);

      const errors = await validate(bookCreateDto);

      // Mock save method
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(payload);

      // Act
      const result = await bookService.create(bookCreateDto); // Call the create method on the service

      // Assert
      expect(result).toEqual(mockResponse);
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

  describe('findAll', () => {

    it('should return all books when no searchKeyword is provided', async () => {
      const books = [];
      const totalCount = books.length;

      jest.spyOn(bookRepository, 'findAndCount').mockResolvedValueOnce([books, totalCount]);

      const params: QueryParamsDto = { searchKeyword: '', page: 1, limit: 10 };
      const result = await bookService.findAll(params);

      expect(bookRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        data: books,
        total: totalCount,
        page: 1,
        limit: 10,
      });
    });

    it('should filter books by searchKeyword', async () => {
      const books = [/* some mock filtered books */];
      const totalCount = books.length;

      jest.spyOn(bookRepository, 'findAndCount').mockResolvedValueOnce([books, totalCount]);

      const params: QueryParamsDto = { searchKeyword: 'Test', page: 1, limit: 10 };
      const result = await bookService.findAll(params);

      expect(bookRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          name: Like('%Test%'),
        },
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        data: books,
        total: totalCount,
        page: 1,
        limit: 10,
      });
    });

    it('should handle pagination correctly for the second page', async () => {
      const books = [/* some mock books */];
      const totalCount = books.length;

      jest.spyOn(bookRepository, 'findAndCount').mockResolvedValueOnce([books, totalCount]);

      const params: QueryParamsDto = { searchKeyword: '', page: 2, limit: 10 };
      const result = await bookService.findAll(params);

      expect(bookRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 10, // (2 - 1) * 10
      });

      expect(result).toEqual({
        data: books,
        total: totalCount,
        page: 2,
        limit: 10,
      });
    });

  });


  describe("findOne", () => {
    it("should return book details if found", async () => {
      // Arrange
      const params: any = {
        id: 1
      }
      const mockResult: any = {
        data: {
          id: 1,
          name: "book 1",
          descrition: "book 1 description",
          price: 10
        },
      };
      // Act
      // Act
      jest.spyOn(bookRepository, "findOne").mockResolvedValueOnce(mockResult.data);
      const result = await bookService.findOne(params.id);

      // Assert
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: params.id },
      });
      expect(result).toEqual(mockResult);
    });

    it("should return BOOK_NOT_FOUND message if the book is not found", async () => {
      // Arrange
      const params: any = { id: 2 }
      const mockResult: any = {
        message: constant.BOOK_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND
      };
      // Act
      jest.spyOn(bookRepository, "findOne").mockResolvedValueOnce(mockResult?.data);
      const result = await bookService.findOne(params);

      // Assert
      expect(result).toEqual({
        message: constant.BOOK_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
    it('should not pass id to the repository', async () => {
      let params: any = {}
      const bookCreateDto = plainToInstance(BookViewDto, params);
      const errors = await validate(bookCreateDto);
      expect(errors[0].property).toEqual('id');
      expect(errors[0].constraints[Object.keys(errors[0].constraints)[1]]).toEqual('Id must be a valid number.');
    })
    it("should pass null id to the repository", async () => {
      let params: any = { id: undefined }
      const bookCreateDto = plainToInstance(BookViewDto, params);
      const errors = await validate(bookCreateDto);
      expect(errors[0].property).toEqual('id');
      expect(errors[0].constraints[Object.keys(errors[0].constraints)[0]]).toEqual('id must be a positive number');

    })

    it("should pass string id to the repository", async () => {
      let params: any = { id: "test" }
      const bookCreateDto = plainToInstance(BookViewDto, params);
      const errors = await validate(bookCreateDto)
      expect(errors[0].property).toEqual('id');
      expect(errors[0].constraints[Object.keys(errors[0].constraints)[0]]).toEqual('id must be a positive number');
      expect(errors[0].constraints[Object.keys(errors[0].constraints)[1]]).toEqual('Id must be a valid number.');
    })

    it('should pass negative number id to the repository', async () => {
      let params: any = { id: -4 }
      const bookCreateDto = plainToInstance(BookViewDto, params);
      const errors = await validate(bookCreateDto)
      expect(errors[0].property).toEqual('id');
      expect(errors[0].constraints[Object.keys(errors[0].constraints)[0]]).toEqual('id must be a positive number');

    })

    it('should pass number id to the repository', async () => {
      let params: any = { id: 1 }
      const bookCreateDto = plainToInstance(BookViewDto, params);
      const errors = await validate(bookCreateDto)
      expect(errors.length).toEqual(0)
    })
  });

  describe("Update", () => {

    it("should update the book and return BOOK_UPDATED message if the book is found", async () => {
      // Arrange
      const params: any = { id: 1 };
      const payload: any = { name: "book updated" };
      const mockFoundBook: any = {
        id: 1,
        name: "book 1",
        descrition: "book 1 description",
        price: 10,
      };
      const mockUpdatedBook: any = {
        ...mockFoundBook,
        name: payload.name,
      };
      const mockResponse: any = {
        data: mockUpdatedBook,
        message: constant.BOOK_UPDATED,
      };

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(mockFoundBook);
      jest.spyOn(bookRepository, 'update').mockResolvedValueOnce(null); // update usually doesn't return a value
      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(mockUpdatedBook);

      // Act
      const result = await bookService.update(params.id, payload);

      // Assert
      expect(bookRepository.findOne).toHaveBeenCalledWith({ where: { id: params.id } });
      expect(bookRepository.update).toHaveBeenCalledWith(params.id, payload);
      expect(result).toEqual(mockResponse);
    });

    it("should return book not found ", async () => {
      // Arrange
      const params: any = { id: null };
      const payload: any = { name: "book updated" };

      const mockResponse: any = {
        message: constant.BOOK_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(params?.id);
      // Act
      const result = await bookService.update(params.id, payload);
      // Assert
      expect(result).toEqual(mockResponse);
    });

  })
  describe("delete", () => {
    it("should delete the book and return BOOK_DELETED message if the book is found", async () => {
      // Arrange
      const params: any = { id: 1 };
      const mockResult: any = {
        message: constant.BOOK_DELETED,
      };
      const mockBook: any = {
        id: 1,
        name: "book 1",
        description: "book 1 description",
        price: 10,
      };

      // Mock the repository methods
      jest.spyOn(bookRepository, "findOne").mockResolvedValueOnce(mockBook);
      jest.spyOn(bookRepository, "delete").mockResolvedValueOnce(undefined);

      // Act
      const result = await bookService.remove(params.id);

      // Assert
      expect(bookRepository.findOne).toHaveBeenCalledWith({ where: { id: params.id } });
      expect(bookRepository.delete).toHaveBeenCalledWith({ id: mockBook.id });
      expect(result).toEqual(mockResult);
    });

    it("should return BOOK_NOT_FOUND message if the book is not found", async () => {
      // Arrange
      const params: any = { id: 2 };
      const mockResult: any = {
        message: constant.BOOK_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };

      // Mock the repository method to return null
      jest.spyOn(bookRepository, "findOne").mockResolvedValueOnce(null);

      // Act
      const result = await bookService.remove(params.id);

      // Assert
      expect(bookRepository.findOne).toHaveBeenCalledWith({ where: { id: params.id } });
      expect(bookRepository.delete).not.toHaveBeenCalled(); // Ensure delete is not called
      expect(result).toEqual(mockResult);
    });

  });
});
