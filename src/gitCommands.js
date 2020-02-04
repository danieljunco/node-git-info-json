import cpp from "child-process-promise";
const { exec } = cpp;

const trim = result => result.stdout.trim();

export const getBranch = () =>
  exec('git rev-parse --abbrev-ref HEAD').then(trim);

export const getCommitId = () => exec("git rev-parse HEAD").then(trim);

export const getTag = () => exec("git describe --tags").then(trim);
