const keys = {
  from: "من",
  to: "الي",
  reason: "السبب",
};

export default (key) => {
  if (keys[key]) return keys[key];
  else return key;
};
