import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import SchemaBuilder from '@pothos/core';
import { todos, Todo } from './types';

const builder = new SchemaBuilder<{
  Objects: {
    Todo: Todo;
  };
}>({});

builder.objectType('Todo', {
  fields: (t) => ({
    id: t.string({ resolve: (todo: Todo) => todo.id }),
    title: t.string({ resolve: (todo: Todo) => todo.title }),
    completed: t.boolean({ resolve: (todo: Todo) => todo.completed }),
    createdAt: t.string({ resolve: (todo: Todo) => todo.createdAt.toISOString() }),
  }),
});

builder.queryType({
  fields: (t) => ({
    todos: t.field({
      type: ['Todo'],
      resolve: () => todos,
    }),
    todo: t.field({
      type: 'Todo',
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: (_, { id }: { id: string }) => todos.find((todo) => todo.id === id) || null,
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createTodo: t.field({
      type: 'Todo',
      args: {
        title: t.arg.string({ required: true }),
      },
      resolve: (_, { title }: { title: string }) => {
        const todo: Todo = {
          id: String(todos.length + 1),
          title,
          completed: false,
          createdAt: new Date(),
        };
        todos.push(todo);
        return todo;
      },
    }),
    updateTodo: t.field({
      type: 'Todo',
      args: {
        id: t.arg.string({ required: true }),
        title: t.arg.string(),
        completed: t.arg.boolean(),
      },
      resolve: (_, { id, title, completed }: { id: string; title?: string; completed?: boolean }) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) throw new Error('Todo not found');

        if (title !== undefined) todo.title = title;
        if (completed !== undefined) todo.completed = completed;

        return todo;
      },
    }),
    deleteTodo: t.field({
      type: 'Todo',
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: (_, { id }: { id: string }) => {
        const index = todos.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('Todo not found');

        const [todo] = todos.splice(index, 1);
        return todo;
      },
    }),
  }),
});


const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

const port =  4000;
server.listen(port, () => {
  console.log(`Server Started at http://localhost:4000/graphql`);
}); 