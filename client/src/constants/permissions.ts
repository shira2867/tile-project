export const permissions = {
  viewer: {
    view: true,
    editColor: false,
    create: false,
    delete: false,
  },
  editor: {
    view: true,
    editColor: true,
    create: false,
    delete: false,
  },
  moderator: {
    view: true,
    editColor: true,
    create: true,
    delete: true,
  },
  admin: {
    view: true,
    editColor: true,
    create: true,
    delete: true,
  },
};
