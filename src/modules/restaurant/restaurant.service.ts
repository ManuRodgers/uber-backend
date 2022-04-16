import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { CategoriesOutput } from './dto/categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dto/my-restaurant.dto';
import { MyRestaurantsOutput } from './dto/my-restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dto/search-restaurant.dto';
import { UpdateDishInput, UpdateDishOutput } from './dto/update-dish.dto';
import {
  UpdateRestaurantInput,
  UpdateRestaurantOutput,
} from './dto/update-restaurant.dto';
import { Category } from './entities/category.entity';
import { DishOption } from './entities/dish-option.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(DishOption)
    private readonly dishOptionRepository: Repository<DishOption>,
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
          menu: true,
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
            menu: true,
          },
          select: {
            id: true,
            name: true,
            owner: {
              id: true,
              email: true,
              role: true,
            },
            menu: {
              id: true,
              name: true,
              price: true,
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

  async createDish(
    ownerId: string,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: {
          id: createDishInput.restaurantId,
          owner: {
            id: ownerId,
          },
        },
        relations: {
          // ?maybe performance issue
          menu: true,
        },
      });
      if (!restaurant) {
        throw new ForbiddenException(
          'Restaurant not found or you are not owner of this restaurant',
        );
      }
      if (
        restaurant.menu.length !== 0 &&
        restaurant.menu.map((dish) => dish.name).includes(createDishInput.name)
      ) {
        throw new ForbiddenException('Dish already exists for this restaurant');
      }
      const dish = await this.dishRepository.save(
        this.dishRepository.create({
          ...createDishInput,
          restaurant: {
            id: restaurant.id,
          },
          options:
            createDishInput.options && createDishInput.options.length > 0
              ? createDishInput.options
              : [],
        }),
      );
      return {
        ok: true,
        dish,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async updateDish(
    ownerId: string,
    updateDishInput: UpdateDishInput,
  ): Promise<UpdateDishOutput> {
    try {
      const dish = await this.dishRepository.findOne({
        where: {
          id: updateDishInput.dishId,
          restaurant: {
            owner: {
              id: ownerId,
            },
          },
        },
        relations: {
          restaurant: {
            owner: true,
            category: true,
          },
          options: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          restaurant: {
            id: true,
            name: true,
            address: true,
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
          options: true,
        },
      });
      if (!dish) {
        throw new ForbiddenException(
          'Dish not found or you do not have permission to update',
        );
      }
      const updatedDish = await this.dishRepository.save(
        this.dishRepository.create({
          ...dish,
          ...updateDishInput,
        }),
      );
      return {
        ok: true,
        dish: updatedDish,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async deleteDish(
    ownerId: string,
    deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      await this.deleteNullDishOptions();
      const dish = await this.dishRepository.findOne({
        where: {
          id: deleteDishInput.dishId,
          restaurant: {
            owner: {
              id: ownerId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
        },
      });
      console.log(
        '🚀 ~ file: restaurant.service.ts ~ line 556 ~ RestaurantService ~ dish',
        dish,
      );
      if (!dish) {
        throw new ForbiddenException(
          'Dish not found or you do not have permission to delete',
        );
      }
      await this.dishRepository.remove(dish);
      return {
        ok: true,
        dish,
      };
    } catch (error) {
      console.error(error);
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

  private async deleteNullDishOptions(): Promise<void> {
    const dishOptions = await this.dishOptionRepository.find({
      where: {
        dish: IsNull(),
      },
    });
    for (const dishOption of dishOptions) {
      await this.dishOptionRepository.remove(dishOption);
    }
  }
}
