import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  RequestContext,
} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {Todo} from '../models';
import {TodoRepository, UserRepository} from '../repositories';

export class TodoController {
  constructor(
    @inject.context() public context: RequestContext,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(TodoRepository) public todoRepository: TodoRepository,
  ) {}

  private checkAuth = (): any => {
    try {
      const token = this.context.request.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, 'JWT_secret');
        if (decoded) {
          return decoded;
        }
      }
      throw {};
    } catch (err) {
      throw {
        code: 401,
        message: 'Unauthorized',
      };
    }
  };

  // GET ALL
  @get('/todos', {
    responses: {
      '200': {
        description: 'Array of Todo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Todo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(): Promise<Todo[]> {
    const currentUser = this.checkAuth();
    return this.todoRepository.find({where: {userId: currentUser.id}});
  }

  // CREATE
  @post('/todos', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodo',
            exclude: ['id'],
          }),
        },
      },
    })
    todo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    const currentUser = this.checkAuth();
    todo.userId = currentUser.id;
    return this.todoRepository.create(todo);
  }

  @get('/todos/{id}', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Todo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Todo> {
    const currentUser = this.checkAuth();
    const userTodos = await this.userRepository
      .todos(currentUser.id)
      .find({where: {id: id}});
    if (userTodos.length == 0) {
      throw {
        code: 401,
        message: 'Unauthorized',
      };
    }
    return userTodos[0];
  }

  @patch('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    const currentUser = this.checkAuth();
    const userTodos = await this.todoRepository.findOne({
      where: {id: id, userId: currentUser.id},
    });
    if (!userTodos) {
      throw {
        code: 401,
        message: 'Unauthorized',
      };
    }
    todo.userId = currentUser.id;
    return await this.todoRepository.updateById(id, todo);
  }

  @put('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<void> {
    const currentUser = this.checkAuth();
    const userTodo = await this.todoRepository.findOne({
      where: {id: id, userId: currentUser.id},
    });
    if (!userTodo) {
      throw {
        code: 401,
        message: 'Unauthorized',
      };
    }
    todo.userId = currentUser.id;
    return await this.todoRepository.replaceById(id, todo);
  }

  @del('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const currentUser = this.checkAuth();
    const userTodos = await this.todoRepository.findOne({
      where: {id: id, userId: currentUser.id},
    });
    if (!userTodos) {
      throw {
        code: 401,
        message: 'Unauthorized',
      };
    }
    return await this.todoRepository.deleteById(id);
  }
}
