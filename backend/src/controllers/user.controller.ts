import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  RequestContext,
} from '@loopback/rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {checkAuth, generateToken} from '../utils';

class UserCredentials {
  username: string;
  password: string;
}

export class UserController {
  constructor(
    @inject.context() public context: RequestContext,
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  // SIGNUP
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
  ): Promise<{token: string, user: {id?: number, username: string}}> {
    const foundUser = await this.userRepository.findOne({
      where: {username: userCredentials.username},
    });
    if (foundUser) {
      throw new HttpErrors.Conflict('Username already exists');
    }
    const password_hash = await bcrypt.hash(userCredentials.password, 10);
    let newUser = new User();
    newUser.username = userCredentials.username;
    newUser.password_hash = password_hash;
    newUser = await this.userRepository.create(newUser);
    const token = generateToken({id: newUser.id, username: newUser.username});
    return {
      token: token,
      user: {
        id: newUser.id,
        username: newUser.username
      }
    };
  }

  // LOGIN
  @post('/users/login', {
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
  ): Promise<{token: string, user: {id?: number, username: string}}> {
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
          const token = generateToken({id: user.id, username: user.username});
          return {
            token: token,
            user: {
              id: user.id,
              username: user.username
            }
          };
        }
      }
    } catch (error) {}
    throw new HttpErrors.Unauthorized('Failed to log in');
  }

  // DELETE
  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const currentUser = checkAuth(this.context);
    if (currentUser.id !== id) {
      throw new HttpErrors.Forbidden('Not allowed');
    }
    await this.userRepository.deleteById(id);
  }
}
