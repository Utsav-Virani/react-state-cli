import path from "path";
import fs from "fs-extra";
import { parseInitState } from "./utils";
import ejs from "ejs";

export async function generateFilesFromInitState(initStatePath: string) {
  const sliceDir = path.dirname(initStatePath);
  const sliceName = path.basename(sliceDir);
  const reduxDir = path.resolve(sliceDir, ".."); // goes to /redux
  const stateFilePath = path.resolve(reduxDir, "state.ts");

  const initState = await parseInitState(initStatePath);
  const keys = Object.keys(initState);

  // --- Generate slice.ts ---
  const actionCases = keys
    .map(
      (key) =>
        `    set${capitalize(
          key
        )}: (state, action) => { state.${key} = action.payload },`
    )
    .join("\n");

  const actionExports = keys.map((key) => `set${capitalize(key)}`).join(", ");

  const sliceTemplate = await fs.readFile(
    path.resolve(__dirname, "../templates/slice.ts.tpl"),
    "utf-8"
  );
  const interfaceName = `${capitalize(sliceName)}State`;

  const renderedSlice = ejs.render(sliceTemplate, {
    sliceName,
    initialStateString: JSON.stringify(initState, null, 2),
    actionCases,
    actionExports,
    interfaceName,
  });

  await fs.writeFile(path.resolve(sliceDir, "slice.ts"), renderedSlice);
  console.log(`✅ slice.ts generated at ${sliceDir}`);

  // --- Generate reducers.ts ---
  const reducersTemplate = await fs.readFile(
    path.resolve(__dirname, "../templates/reducers.ts.tpl"),
    "utf-8"
  );

  const inferType = (value: any): string => {
    if (Array.isArray(value)) return "any[]";
    if (value === null) return "any";
    return typeof value;
  };

  await fs.writeFile(path.resolve(sliceDir, "reducers.ts"), reducersTemplate);
  console.log(`✅ reducers.ts generated at ${sliceDir}`);

  // --- Generate slice.types.ts ---
  

  const interfaceLines = Object.entries(initState).map(([key, value]) => {
    return `  ${key}: ${inferType(value)}`;
  });

  const interfaceString = `export interface ${interfaceName} {\n${interfaceLines.join(
    "\n"
  )}\n}`;

  const typesPath = path.resolve(sliceDir, "types.ts");
  await fs.writeFile(typesPath, interfaceString);
  console.log(`✅ types.ts generated at ${typesPath}`);

  // --- Generate or update state.ts ---
  const stateTemplatePath = path.resolve(
    __dirname,
    "../templates/state.ts.tpl"
  );
  const stateTemplate = await fs.readFile(stateTemplatePath, "utf-8");

  const renderedState = ejs.render(stateTemplate, {
    sliceName,
    interfaceName
  });

  const stateExists = await fs.pathExists(stateFilePath);

  if (!stateExists) {
    await fs.writeFile(stateFilePath, renderedState);
    console.log(`✅ state.ts created at ${stateFilePath}`);
  } else {
    console.warn(
      `⚠️  state.ts already exists. Append logic not yet implemented.`
    );
    // Optional enhancement: Use ts-morph to append new slice to existing RootState
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
