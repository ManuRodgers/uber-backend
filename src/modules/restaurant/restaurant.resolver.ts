import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
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

import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import { DeleteDishOutput, DeleteDishInput } from './dto/delete-dish.dto';
import { UpdateDishOutput, UpdateDishInput } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Roles(['OWNER'])
  async createRestaurant(
    @CurrentUserId() userId: string,
    @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      userId,
      createRestaurantInput,
    );
  }

  @Query(() => MyRestaurantsOutput)
  @Roles(['OWNER'])
  async myRestaurants(
    @CurrentUserId() ownerId: string,
  ): Promise<MyRestaurantsOutput> {
    return this.restaurantService.myRestaurants(ownerId);
  }

  @Query(() => MyRestaurantOutput)
  @Roles(['OWNER'])
  async myRestaurant(
    @CurrentUserId() ownerId: string,
    @Args('myRestaurantInput') myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    return this.restaurantService.myRestaurant(ownerId, myRestaurantInput);
  }

  @Mutation(() => UpdateRestaurantOutput)
  @Roles(['OWNER'])
  async updateRestaurant(
    @CurrentUserId() ownerId: string,
    @Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantInput,
  ): Promise<UpdateRestaurantOutput> {
    return this.restaurantService.updateRestaurant(
      ownerId,
      updateRestaurantInput,
    );
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Roles(['OWNER'])
  async deleteRestaurant(
    @CurrentUserId() ownerId: string,
    @Args('deleteRestaurantInput') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      ownerId,
      deleteRestaurantInput,
    );
  }

  @Query(() => RestaurantsOutput)
  @Roles(['ANY'])
  async restaurants(
    @Args('restaurantsInput') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.restaurants(restaurantsInput);
  }

  @Query(() => RestaurantOutput)
  @Roles(['ANY'])
  async restaurant(
    @Args('restaurantInput') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.restaurant(restaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  @Roles(['ANY'])
  async searchRestaurant(
    @Args('searchRestaurantInput') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurant(searchRestaurantInput);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(() => Int)
  @Roles(['ANY'])
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.restaurantCount(category);
  }

  @Query(() => CategoriesOutput)
  @Roles(['ANY'])
  async categories(): Promise<CategoriesOutput> {
    return this.restaurantService.categories();
  }

  @Query(() => CategoryOutput)
  @Roles(['ANY'])
  async category(
    @Args('categoryInput') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.category(categoryInput);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateDishOutput)
  @Roles(['OWNER'])
  async createDish(
    @CurrentUserId() ownerId: string,
    @Args('createDishInput') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(ownerId, createDishInput);
  }

  @Mutation(() => UpdateDishOutput)
  @Roles(['OWNER'])
  async updateDish(
    @CurrentUserId() ownerId: string,
    @Args('updateDishInput') updateDishInput: UpdateDishInput,
  ): Promise<UpdateDishOutput> {
    return this.restaurantService.updateDish(ownerId, updateDishInput);
  }

  @Mutation(() => DeleteDishOutput)
  @Roles(['OWNER'])
  async deleteDish(
    @CurrentUserId() ownerId: string,
    @Args('deleteDishInput') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(ownerId, deleteDishInput);
  }
}
