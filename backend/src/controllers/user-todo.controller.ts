import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  RequestContext,
} from '@loopback/rest';
import {Todo} from '../models';
import {UserRepository} from '../repositories';
import {checkAuth} from '../utils';

export class UserTodoController {
  constructor(
    @inject.context() public context: RequestContext,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  // GET ALL TODOS FOR THE USER
  @get('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'Array of User has many Todo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Todo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    const currentUser = checkAuth(this.context);
    if (currentUser.id != id) {
      throw new HttpErrors.Forbidden('Not allowed');
    }
    return this.userRepository.todos(id).find(filter);
  }
}
