import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    foreignKeys: {
      fk_todo_userId: {
        name: 'fk_todo_userId',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'userid',
      },
    },
  },
})
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  done: boolean;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
