```npm install```
```npm run dev```


## URL
```http://localhost:4000/graphql```

## Query
### get all todo
```query {
  todos {
    id
    title
    completed
    createdAt
  }
}```

### Get single todo
```
query {
  todo(id: "1") {
    id
    title
    completed
    createdAt
  }
}
```

### create todo
```
mutation {
  createTodo(title: "Buy groceries") {
    id
    title
    completed
    createdAt
  }
}
```

### update todo
```
mutation {
  updateTodo(id: "1", title: "Buy more groceries", completed: true) {
    id
    title
    completed
    createdAt
  }
}
```

### Delete todo
```
mutation {
  deleteTodo(id: "1") {
    id
    title
    completed
    createdAt
  }
}
```