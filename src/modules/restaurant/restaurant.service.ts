import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesOutput } from 'src/modules/restaurant/dto/categories.dto';
import {
  CategoryInput,
  CategoryOutput,
} from 'src/modules/restaurant/dto/category.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from 'src/modules/restaurant/dto/delete-restaurant.dto';
import {
  MyRestaurantInput,
  MyRestaurantOutput,
} from 'src/modules/restaurant/dto/my-restaurant.dto';
import { MyRestaurantsOutput } from 'src/modules/restaurant/dto/my-restaurants.dto';
import {
  RestaurantInput,
  RestaurantOutput,
} from 'src/modules/restaurant/dto/restaurant.dto';
import {
  RestaurantsInput,
  RestaurantsOutput,
} from 'src/modules/restaurant/dto/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from 'src/modules/restaurant/dto/search-restaurant.dto';
import {
  UpdateRestaurantInput,
  UpdateRestaurantOutput,
} from 'src/modules/restaurant/dto/update-restaurant.dto';
import { Category } from 'src/modules/restaurant/entities/category.entity';
import { Like, Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createRestaurant(
    userId: string,
    { categoryName, ...restCreateRestaurantInput }: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.save(
        this.restaurantRepository.create({
          ...restCreateRestaurantInput,
          owner: await this.userService.getUserById(userId),
          category: await this.getOrCreateCategory(categoryName),
        }),
      );
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async updateRestaurant(
    ownerId: string,
    {
      restaurantId,
      categoryName,
      ...restUpdateRestaurantInput
    }: UpdateRestaurantInput,
  ): Promise<UpdateRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: {
          id: restaurantId,
          owner: {
            id: ownerId,
          },
        },
        relations: {
          category: true,
        },
      });
      if (!restaurant) {
        throw new ForbiddenException('Restaurant not found');
      }
      if (categoryName) {
        restaurant.category = await this.getOrCreateCategory(categoryName);
      }
      return {
        ok: true,
        restaurant: await this.restaurantRepository.save(
          this.restaurantRepository.merge(
            restaurant,
            restUpdateRestaurantInput,
          ),
        ),
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async deleteRestaurant(
    ownerId: string,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: {
          id: restaurantId,
          owner: {
            id: ownerId,
          },
        },
        relations: {
          category: true,
        },
      });
      if (!restaurant) {
        throw new ForbiddenException('Restaurant not found');
      }
      await this.restaurantRepository.remove(restaurant);
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async categories(): Promise<CategoriesOutput> {
    try {
      const categories = await this.categoryRepository.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async restaurantCount(category: Category): Promise<number> {
    try {
      return await this.restaurantRepository.countBy({
        category: {
          id: category.id,
        },
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async category({
    categorySlug: slug,
    page,
    take,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categoryRepository.findOneBy({
        slug,
      });
      if (!category) {
        throw new ForbiddenException('Category not found');
      }
      const [restaurants, restaurantCount] =
        await this.restaurantRepository.findAndCount({
          where: {
            category: {
              id: category.id,
            },
          },
          take,
          skip: (page - 1) * take,
          relations: {
            owner: true,
          },
          select: {
            id: true,
            name: true,
            owner: {
              id: true,
              email: true,
              role: true,
            },
          },
        });
      return {
        ok: true,
        category,
        restaurants,
        totalPages: Math.ceil(restaurantCount / take),
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }
  async myRestaurants(ownerId: string): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurantRepository.findBy({
        owner: {
          id: ownerId,
        },
      });
      if (!restaurants) {
        throw new ForbiddenException('Restaurants not found');
      }
      return {
        ok: true,
        restaurants,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async myRestaurant(
    ownerId: string,
    { id }: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: {
          id,
          owner: {
            id: ownerId,
          },
        },
      });
      if (!restaurant) {
        throw new ForbiddenException('Restaurant not found');
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async restaurants({
    page,
    take,
  }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, restaurantCount] =
        await this.restaurantRepository.findAndCount({
          take,
          skip: (page - 1) * take,
          relations: {
            owner: true,
          },
          select: {
            id: true,
            name: true,
            owner: {
              id: true,
              email: true,
              role: true,
            },
          },
        });
      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(restaurantCount / take),
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async restaurant({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: {
          id: restaurantId,
        },
        relations: {
          owner: true,
          category: true,
        },
        select: {
          id: true,
          name: true,
          owner: {
            id: true,
            email: true,
            role: true,
          },
          category: {
            id: true,
            name: true,
          },
        },
      });
      if (!restaurant) {
        throw new ForbiddenException('Restaurant not found');
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async searchRestaurant({
    page,
    take,
    query,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, restaurantCount] =
        await this.restaurantRepository.findAndCount({
          where: {
            name: Like(`%${query}%`),
          },
          take,
          skip: (page - 1) * take,
          relations: {
            owner: true,
            category: true,
          },
          select: {
            id: true,
            name: true,
            owner: {
              id: true,
              email: true,
              role: true,
            },
            category: {
              id: true,
              name: true,
            },
          },
        });
      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(restaurantCount / take),
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  private async getOrCreateCategory(categoryName: string): Promise<Category> {
    const categorySlug = categoryName.trim().toLowerCase().replace(/ /g, '-');
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        slug: categorySlug,
      },
    });
    let newCategory = null;
    if (!existingCategory) {
      newCategory = await this.categoryRepository.save(
        this.categoryRepository.create({
          name: categoryName,
          slug: categorySlug,
        }),
      );
    }
    return newCategory || existingCategory;
  }
}
