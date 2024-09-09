import { Test, TestingModule } from "@nestjs/testing";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { BookCreateDto, BookViewDto } from "./dto/book.dto";
import { HttpStatus } from "@nestjs/common";
import { ResponseInterface } from "../core/interfaces/response.interface";
import { CustomHttpException } from "../../src/core/exception-filters/custom.http.exception";

describe("BookController", () => {
  let bookController: BookController;
  let bookService: BookService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  describe("create", () => {
    it("should create a new book successfully", async () => {
      // Arrange
      const payload: BookCreateDto = {
        name: "Test Book",
        description: "Test Description",
        price: 15,
      };

      const mockResponse = {
        data: {
          ...payload,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        message: "Book created successfully",
        statusCode: HttpStatus.OK,
      };

      jest.spyOn(bookService, "create").mockResolvedValueOnce(mockResponse);

      // Act
      const result: ResponseInterface = await bookController.create(payload);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          error: false,
          statusCode: HttpStatus.OK,
          message: "Book created successfully",
          displayMessage: false,
          data: expect.objectContaining({
            id: 1,
            name: "Test Book",
            description: "Test Description",
            price: 15,
          }),
        }),
      );
      expect(bookService.create).toHaveBeenCalledWith(payload);
    });

    it("should handle an error during book creation", async () => {
      // Arrange
      const payload: BookCreateDto = {
        name: "Test Book",
        description: "Test Description",
        price: 15,
      };

      const errorMessage = "Internal Server Error";
      const mockError = new CustomHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage,
        false,
        true,
        null,
      );

      jest.spyOn(bookService, "create").mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(bookController.create(payload)).rejects.toThrowError(
        new CustomHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage,
          false,
          true,
          null,
        ),
      );
      expect(bookService.create).toHaveBeenCalledWith(payload);
    });

    it("should throw an error if the name is not provided", async () => {
      let payload: any = {
        description: "Test Description",
        price: 15,
      };
      jest
        .spyOn(bookController, "create")
        .mockRejectedValueOnce(new Error("Name is required."));

      await expect(bookController.create(payload)).rejects.toThrowError(
        new CustomHttpException(
          HttpStatus.BAD_REQUEST,
          "Name is required.",
          false,
          true,
          null,
        ),
      );
    });

    it("should throw an error when the description is not provided", async () => {
      let payload: any = {
        name: "Test Book",
        price: 15,
      };
      jest
        .spyOn(bookController, "create")
        .mockRejectedValueOnce(new Error("Description is required."));
      await expect(bookController.create(payload)).rejects.toThrowError(
        new CustomHttpException(
          HttpStatus.BAD_REQUEST,
          "Description is required.",
          false,
          true,
          null,
        ),
      );
    });
    it("should throw an error if the price is not a number", async () => {
      const payload: any = {
        name: "Test Book",
        description: "Test Description",
        price: "testst",
      };

      jest
        .spyOn(bookService, "create")
        .mockRejectedValueOnce(new Error("Price must be a valid number."));

      // Act & Assert
      await expect(bookController.create(payload)).rejects.toThrowError(
        new CustomHttpException(
          HttpStatus.BAD_REQUEST,
          "Price must be a valid number.",
          false,
          true,
          null,
        ),
      );
    });

    it("should throw an error if the price is not positive", async () => {
      let payload: any = {
        name: "Test Book",
        description: "Test Description",
        price: -5,
      };
      jest
        .spyOn(bookController, "create")
        .mockRejectedValueOnce(new Error("Price must be a positive number."));

      await expect(bookController.create(payload)).rejects.toThrowError(
        new CustomHttpException(
          HttpStatus.BAD_REQUEST,
          "Price must be a positive number.",
          false,
          true,
          null,
        ),
      );
    });
  });

  describe("findOne", () => {
    it("should retunr a book successfully", async () => {
      let params: BookViewDto = {
        id: 1, // Assign the correct property according to the BookViewDto type
      };
      const mockResponse: any = {
        data: {
          id: 1,
          name: "Test Book",
          description: "Test Description",
          price: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        message: "Book found successfully",
        statusCode: HttpStatus.OK,
      };

      jest.spyOn(bookService, "findOne").mockResolvedValueOnce(mockResponse);
      const result = await bookController.findOne(params);

      expect(result).toEqual(expect.objectContaining(mockResponse));
    });

    it("should throw an error if the book is not found", async () => {
      let params: BookViewDto = {
        id: 2, // Assign the correct property according to the BookViewDto type
      };

      const mockError = new CustomHttpException(
        HttpStatus.NOT_FOUND,
        "Book not found",
        false,
        true,
        null,
      );

      jest.spyOn(bookController, "findOne").mockRejectedValueOnce(mockError);

      await expect(bookController.findOne(params)).rejects.toThrowError(
        mockError,
      );
    });

    it("should throw an error if the book valide id is not provided", async () => {
      let params: BookViewDto = {
        id: null,
      };

      const mockError = new CustomHttpException(
        HttpStatus.BAD_REQUEST,
        "Book id is required",
        false,
        true,
        null,
      );
      jest.spyOn(bookController, "findOne").mockRejectedValueOnce(mockError);
      await expect(bookController.findOne(params)).rejects.toThrowError(
        mockError,
      );
    });
    it("should throw exception when something goes wrong", async () => {
      let params: BookViewDto = {
        id: 1,
      };
      const mockError = new CustomHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong",
        false,
        true,
        null,
      );
      jest.spyOn(bookController, "findOne").mockRejectedValueOnce(mockError);
      await expect(bookController.findOne(params)).rejects.toThrowError(
        mockError,
      );
    });
  });
});
