import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Todo} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TodoRepository} from './todo.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly todos: HasManyRepositoryFactory<Todo, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TodoRepository') protected todoRepositoryGetter: Getter<TodoRepository>,
  ) {
    super(User, dataSource);
    this.todos = this.createHasManyRepositoryFactoryFor('todos', todoRepositoryGetter,);
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
  }
}
