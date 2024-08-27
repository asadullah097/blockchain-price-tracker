import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Repository } from 'typeorm';
import { BooksEntity } from '../entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { constant } from '../utils/constant';

const mockbookRepository = {
  save: jest.fn().mockImplementation((bookObject) => ({
    ...bookObject,
  })),
  findOne: jest.fn().mockImplementation((options) => {
    // Simulate finding a book based on the provided options
    if (options.where.id === 1) {
      return {
        id: 1,
        name: 'book 1',
      };
    }
    // Simulate not finding a book
    return undefined;
  }),
  delete: jest.fn().mockImplementation(() => ({ affected: 1 })),
};
describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Repository<BooksEntity>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(BooksEntity),
          useValue: mockbookRepository,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<BooksEntity>>(
      getRepositoryToken(BooksEntity),
    );
  });

  describe('create', () => {
    it('should create a new Book', async () => {
      // Arrange
      const params = {
        name: 'Testing Book',
        description: 'Test description',
        price: 11,
      };

      // Act
      const result = await bookService.create(params);

      // Assert
      expect(result).toEqual({
        data: {
          // Assuming the save function returns the saved entity
          id: result?.data?.id,
          ...params,
        },
        message: constant.BOOK_CREATE,
      });

      // Ensure that the repository's save method was called with the correct parameters
      expect(bookRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(params),
      );
    });
  });

  describe('findOne', () => {
    it('should return book details if found', async () => {
      // Arrange
      const bookId = 1;

      // Act
      const result = await bookService.findOne(bookId);

      // Assert
      expect(result).toEqual({
        data: {
          id: 1,
          name: 'Book 1',
        },
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });

    it('should return BOOK_NOT_FOUND message if the book is not found', async () => {
      // Arrange
      const bookId = 2;

      // Act
      const result = await bookService.findOne(bookId);

      // Assert
      expect(result).toEqual({
        message: constant.BOOK_NOT_FOUND,
      });

      // Ensure that the repository's findOne method was called with the correct parameters
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });
  });

  describe('delete', () => {
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
