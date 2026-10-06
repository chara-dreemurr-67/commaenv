# commaenv

`commaenv` is a tiny typed environment variable parser for Node.js. It reads from `process.env`, validates values, and gives you typed access without loading `.env` files or depending on `dotenv`.

## Why use it?

This package is useful when you want:

- typed environment values instead of raw strings
- default values for missing variables
- strict validation for strings, numbers, booleans, arrays, and literal unions
- lightweight runtime behavior without extra config

## Installation

```bash
npm install commaenv
```

## Basic usage

### Use the global Env singleton
```ts
import Env from "commaenv";

Env.RegisterVariable("PORT", Env.number().Default(3000));
Env.RegisterVariable("NODE_ENV", Env.string().Default("development"));
Env.RegisterVariable("DEBUG_MODE", Env.boolean());
Env.RegisterVariable("ALLOWED_ORIGINS", Env.array("string").Default(["https://example.com"]));

const port = Env.GetVariable<number>("PORT");
const nodeEnv = Env.GetVariable<string>("NODE_ENV");
const debugMode = Env.GetVariable<boolean>("DEBUG_MODE");
const origins = Env.GetVariable<string[]>("ALLOWED_ORIGINS");

console.log(port, nodeEnv, debugMode, origins);
```

### Or create your own instance
```ts
import { EnvLoader } from "commaenv";
const Env = new EnvLoaer();

// The rest should be the same as the above example.
```

## Supported types

### String

```ts
Env.RegisterVariable("APP_NAME", Env.string().Default("my-app"));
const appName = Env.GetVariable<string>("APP_NAME");
```

Strings are returned as-is. Empty strings are treated as missing only when a non-string parser is being used.

### Number

```ts
Env.RegisterVariable("PORT", Env.number().Default(8080));
const port = Env.GetVariable<number>("PORT");
```

Accepted values are valid JavaScript numbers. If the value is not numeric, it throws a `TypeError`.

### Boolean

```ts
Env.RegisterVariable("DEBUG", Env.boolean().Default(false));
const debug = Env.GetVariable<boolean>("DEBUG");
```

Boolean values accept the following forms:

- `true`, `1`
- `false`, `0`

The parser normalizes case and trims whitespace before evaluating.

### Literal

```ts
Env.RegisterVariable("NODE_ENV", Env.literal("development", "production", "test"));
const nodeEnv = Env.GetVariable<"development" | "production" | "test">("NODE_ENV");
```

`Env.literal()` accepts a finite set of allowed values. It supports either strings or numbers, and rejects anything outside that set.

```ts
Env.RegisterVariable("HTTP_STATUS", Env.literal(200, 201, 204).Default(204));
const status = Env.GetVariable<200 | 201 | 204>("HTTP_STATUS");
```

For string literals, values are checked after trimming whitespace. For numeric literals, the environment value is parsed as a number before being matched against the allowed values.

### Array

```ts
Env.RegisterVariable("FEATURES", Env.array("string").Default(["auth", "billing"]));
const features = Env.GetVariable<string[]>("FEATURES");
```

Supported array element types are:

- `Env.array("string")`
- `Env.array("number")`

The default parser expects a JSON array string, such as:

```bash
FEATURES='["auth","billing"]'
```

You can also provide a custom parser:

```ts
Env.RegisterVariable(
  "CORS",
  Env.array("string").Parser((value) => value.split(",")).Default(["localhost"])
);
```

## Registering variables

```ts
Env.RegisterVariable("TOKEN");
const token = Env.GetVariable<string>("TOKEN");
```

If you do not pass a type, the package defaults to a string parser.

## Defaults and missing values

When a variable is missing or empty for non-string types, the parser will fall back to the default value if one has been provided:

```ts
Env.RegisterVariable("CACHE_TTL", Env.number().Default(60));
```

If the value is missing and no default exists, it throws a `TypeError`.

## API summary

- `Env.RegisterVariable(name, type?)`
- `Env.GetVariable<T>(name)`
- `Env.string()`
- `Env.number()`
- `Env.boolean()`
- `Env.literal("development", "production")`
- `Env.literal(200, 201, 204)`
- `Env.array("string")`
- `Env.array("number")`

## Notes

- This library does not load `.env` files.
- It only reads from the current `process.env` object.
- The package is designed to be small, explicit, and strict.
- Default import gives you the EnvLoader singleton, while `import { EnvLoader } from "commaenv";` gives you the EnvLoader class so you can create an instance for yourself.

## License

This project is licensed under the GPL-3.0-only license.

## Todo
- ~~add literal type support~~
- ~~make GetVariable infer the type of the variable, if that's even possible~~ currently not possible without major changes to the lib