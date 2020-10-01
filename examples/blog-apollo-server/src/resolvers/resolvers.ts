const posts = [
  {
    id: "post:1",
    title: "Introduction to GraphQL!",
    author: {
      id: "user:1"
    }
  },
  {
    id: "post:2",
    title: "GraphQL-Jit a fast engine for GraphQL",
    author: {
      id: "user:1"
    }
  }
];

const users = [
  {
    id: "user:1",
    name: "Boopathi",
    type: "normal",
    posts: [
      {
        id: "post:1"
      }
    ]
  },
  {
    id: "user:2",
    name: "Rui",
    type: "admin",
    posts: [
      {
        id: "post:2"
      }
    ]
  }
];

function getPost(id: string) {
  const post = posts.find(post => post.id === id);
  if (post == null) {
    throw new Error(`Post "${id} not found"`);
  }
  return post;
}

async function getUser(id: string): Promise<any> {

  return new Promise((resolve, reject) => {
    let wait = setTimeout(() => {
      clearTimeout(wait);
      const user = users.find(user => user.id === id);
      if (user == null) {
        reject(null);
      } else {
        resolve(user)
      }
    }, 200)
  });

}

export default {
  Query: {
    post(_: any, { id }: { id: string }) {
      return getPost(id);
    },
    async user(_: any, { id }: { id: string }) {
      return getUser(id);
    },
    node(_: any, { id }: { id: string }) {
      switch (id.split(":")[0]) {
        case "post":
          return { __typename: "Post", ...getPost(id) };
        case "user":
          return { __typename: "User", ...getUser(id) };
      }
      throw new Error("Invalid id");
    },
    posts() {
      return posts;
    },
    users() {
      return new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
          clearTimeout(wait);
          resolve(users);
        }, 200)
      });
    }
  },
  Node: {
    __resolveType({ __typename }: { __typename: string }) {
      return __typename;
    }
  },
  Post: {
    author({ author }: { author: { id: string } }) {
      return getUser(author.id);
    }
  },
  User: {
    __resolveType: (root: any) => (root.type === 'normal' ? 'UserWeb' : 'UserAdmin'),

  },
  UserWeb: {
    posts({ posts }: { posts: { id: string }[] }) {
      return posts.map(({ id }) => getPost(id));
    }
  }
};
