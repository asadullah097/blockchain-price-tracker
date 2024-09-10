import { Test, TestingModule } from "@nestjs/testing";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { BookCreateDto, BookViewDto, QueryParamsDto } from "./dto/book.dto";
import { HttpStatus } from "@nestjs/common";
import { ResponseInterface } from "../core/interfaces/response.interface";
import { CustomHttpException } from "../../src/core/exception-filters/custom.http.exception";
import { constant } from "../../src/utils/constant";

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
                        findAll: jest.fn(),
                        create: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                        update: jest.fn(),
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

            const mockResponse: any = {
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

            const mockError = new CustomHttpException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                constant.INTERNAL_SERVER_ERROR,
                false,
                true,
                null,
            );

            jest.spyOn(bookService, "create").mockRejectedValueOnce(mockError);

            // Act & Assert
            await expect(bookController.create(payload)).rejects.toThrowError(
                new CustomHttpException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    constant.INTERNAL_SERVER_ERROR,
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
        it("should return a book successfully", async () => {
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
        it("should throw exception when Internal Server Error", async () => {
            let params: any = {
                id: "ddd",
            };
            const mockError = new CustomHttpException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                constant.INTERNAL_SERVER_ERROR,
                false,
                true,
                null,
            );
            jest.spyOn(bookService, "findOne").mockRejectedValueOnce(mockError);
            await expect(bookController.findOne(params)).rejects.toThrowError(
                mockError,
            );
        });
    });

    describe("findAll", () => {
        it("should return all books successfully", async () => {
            let queryParams: QueryParamsDto = {
                page: 1,
                limit: 10,
                searchKeyword: "Test",
            };

            const mockResponse: any = {
                error: false,
                displayMessage: false,
                data: [
                    {
                        id: 1,
                        name: "Test Book",
                        description: "Test Description",
                        price: 15,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
                message: "Success",
                statusCode: HttpStatus.OK,
            };

            // Spy on the service method instead of the controller method
            jest.spyOn(bookService, "findAll").mockResolvedValueOnce(mockResponse);

            const result = await bookController.findAll(queryParams);

            // Assert the expected output
            expect(result).toEqual(mockResponse);
        });

        it("should throw exception when something goes wrong", async () => {
            let queryParams: QueryParamsDto = {
                page: 1,
                limit: -10,
                searchKeyword: "Test",
            };

            const mockError = new CustomHttpException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                constant.INTERNAL_SERVER_ERROR,
                false,
                true,
                null,
            );

            // Spy on the service method and mock an error
            jest.spyOn(bookService, "findAll").mockRejectedValueOnce(mockError);

            await expect(bookController.findAll(queryParams)).rejects.toThrowError(mockError);
        });
    });

    describe("remove", () => {
        it("should remove a book successfully", async () => {
            let params = {
                id: 1
            };
            const mockResponse: any = {
                error: false,
                displayMessage: false,
                message: "Book deleted successfully",
                statusCode: HttpStatus.OK,
                data: []
            };
            jest.spyOn(bookService, "remove").mockResolvedValueOnce(mockResponse);
            const result = await bookController.remove(params);
            expect(result).toEqual(mockResponse);
        });

        it("should throw an error if the book is not found", async () => {
            let params = {
                id: 2
            };
            const mockError = new CustomHttpException(
                HttpStatus.NOT_FOUND,
                "Book not found",
                false,
                true,
                null,
            );
            jest.spyOn(bookService, "remove").mockRejectedValueOnce(mockError);
            await expect(bookController.remove(params)).rejects.toThrowError(mockError);
        });

        it("should throw an error if the book id is not provided", async () => {
            let params = {
                id: null
            };
            const mockError = new CustomHttpException(
                HttpStatus.BAD_REQUEST,
                "Book id is required",
                false,
                true,
                null,
            );
            jest.spyOn(bookController, "remove").mockRejectedValueOnce(mockError);
            await expect(bookController.remove(params)).rejects.toThrowError(mockError);
        });

        it("should throw exception when something goes wrong", async () => {
            let params = {
                id: 1
            };
            const mockError = new CustomHttpException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                constant.INTERNAL_SERVER_ERROR,
                false,
                true,
                null,
            );
            jest.spyOn(bookController, "remove").mockRejectedValueOnce(mockError);
            await expect(bookController.remove(params)).rejects.toThrowError(mockError);
        });

    })

    describe("update", () => {
        it("should update a book successfully", async () => {
            let payload = {
                name: "Test Book",
                description: "Test Description",
                price: 15
            };
            let params = {
                id: 1
            };
            const mockResponse: any = {
                error: false,
                displayMessage: false,
                message: "Book updated successfully",
                statusCode: HttpStatus.OK,
                data: {
                    id: params?.id,
                    ...payload
                }
            };
            jest.spyOn(bookService, "update").mockResolvedValueOnce(mockResponse);
            const result = await bookController.update(payload, params);
            expect(result).toEqual(mockResponse);
        });

        it("should throw an error if the book is not found", async () => {
            let payload = {
                name: "Test Book",
                description: "Test Description",
                price: 15
            };
            let params = {
                id: 2
            };
            const mockError = new CustomHttpException(
                HttpStatus.NOT_FOUND,
                "Book not found",
                false,
                true,
                null,
            );
            jest.spyOn(bookService, "update").mockRejectedValueOnce(mockError);
            await expect(bookController.update(payload, params)).rejects.toThrowError(mockError);
        });

        it("should throw error when invlid payload is provided", async () => {
            let params = {
                id: null
            }
            let payload = {
                name: "Test Book updated"
            }
            const mockError = new CustomHttpException(
                HttpStatus.BAD_REQUEST,
                "Book id is required",
                false,
                true,
                null,
            );
            jest.spyOn(bookService, "update").mockRejectedValueOnce(mockError);
            await expect(bookController.update(payload, params)).rejects.toThrowError(mockError);
        });

        it('should throw exception when something goes wrong', async () => {
            let payload = {
                name: "null"
            }
            let params = {
                id: null
            }
            const errorMock = new CustomHttpException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                constant.INTERNAL_SERVER_ERROR,
                false,
                true,
                null,
            )
            jest.spyOn(bookService, 'update').mockRejectedValueOnce(errorMock)
            await expect(bookController.update(payload, params)).rejects.toThrowError(errorMock)
        })
    })
});
