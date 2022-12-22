export const uuid = (): string =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

const tasks = [
  "Task C",
  "Task D",
  "Task E",
  "Task F",
  "Task G",
  "Task H",
  "Task I",
  "Task J",
  "Task K",
  "Task L",
  "Task M",
  "Task N",
  "Task O",
  "Task P",
  "Task Q",
  "Task R",
  "Task S",
  "Task T",
  "Task U",
  "Task V",
  "Task W",
  "Task X",
  "Task Y",
  "Task Z",
  "Task ß",
  "Task å",
];

export const randomLabel = (): string => {
  return tasks[~~(Math.random() * tasks.length)];
};
