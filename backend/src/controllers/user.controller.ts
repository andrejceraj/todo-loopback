import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models';
import {UserRepository} from '../repositories';

class UserCredentials {
  username: string;
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/signup', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(User)},
        },
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials),
        },
      },
    })
    userCredentials: UserCredentials,
  ): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {username: userCredentials.username},
    });
    if (foundUser) {
      throw {
        code: 409,
        message: 'Username already exists',
      };
    }
    const password_hash = await bcrypt.hash(userCredentials.password, 10);
    const newUser = new User();
    newUser.username = userCredentials.username;
    newUser.password_hash = password_hash;
    return this.userRepository.create(newUser);
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials),
        },
      },
    })
    userCredentials: UserCredentials,
  ): Promise<{token: string}> {
    const user = await this.userRepository.findOne({
      where: {username: userCredentials.username},
    });
    try {
      if (user) {
        const result = await bcrypt.compare(
          userCredentials.password,
          user.password_hash,
        );
        if (result) {
          const token = jwt.sign(
            {id: user.id, username: user.username},
            'JWT_secret',
            {expiresIn: '2h'},
          );
          return {token: token};
        }
      }
    } catch (error) {}
    throw {
      code: 401,
      message: 'Username or password is incorrect',
    };
  }

  // @post('/users', {
  //   responses: {
  //     '200': {
  //       description: 'User model instance',
  //       content: {'application/json': {schema: getModelSchemaRef(User)}},
  //     },
  //   },
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {
  //           title: 'NewUser',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   user: Omit<User, 'id'>,
  // ): Promise<User> {
  //   return this.userRepository.create(user);
  // }

  // @get('/users/count', {
  //   responses: {
  //     '200': {
  //       description: 'User model count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async count(@param.where(User) where?: Where<User>): Promise<Count> {
  //   return this.userRepository.count(where);
  // }

  // @get('/users', {
  //   responses: {
  //     '200': {
  //       description: 'Array of User model instances',
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'array',
  //             items: getModelSchemaRef(User, {includeRelations: true}),
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
  //   return this.userRepository.find(filter);
  // }

  // @patch('/users', {
  //   responses: {
  //     '200': {
  //       description: 'User PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  //   @param.where(User) where?: Where<User>,
  // ): Promise<Count> {
  //   return this.userRepository.updateAll(user, where);
  // }

  // @get('/users/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'User model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(User, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  // ): Promise<User> {
  //   return this.userRepository.findById(id, filter);
  // }

  // @patch('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  // ): Promise<void> {
  //   await this.userRepository.updateById(id, user);
  // }

  // @put('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() user: User,
  // ): Promise<void> {
  //   await this.userRepository.replaceById(id, user);
  // }

  // @del('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.userRepository.deleteById(id);
  // }
}
