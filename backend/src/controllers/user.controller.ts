import {repository} from '@loopback/repository';
import {del, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
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

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
