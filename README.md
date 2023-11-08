# Discord Dev Env

This template serves the purpose of making the developpement of discord bots less tedious. It is shipped with many features like a .yaml config loader and other cool things.

## Features

The most important features are:
- Working Path Aliases
    > No more `../../folder/file.txt` in your imports! You can now define path aliases in the `tsconfig.json` file so you can import your files like `@src/folder/file`.
- YAML Config Loader
    > There's a global function available named `loadYaml()`. In the config, you can specify a path from where to load files from.
    > Example:
    > ```ts
        const config = loadYaml("admins.yml")
        console.log(config)

        // Output: { origaming: "cool", you: "awesome!" }
    ```

There's also utilites functions (`@src/core/utilites.ts`)
- ANSI color formatting
    > ```ts
        console.log(ansi("%yellow%This message is yellow!%end%"))
        ```
    > You can see and add more colors by peeking into the file.
- Logging function
    > Simple logging with colors (info, warn, error, success, minimal)

More features will come in the future!

### Contributing

Feel free to open issues, PRs, etc... I'm not very familiar with git so I may take a little bit of time to accept your changes. Please note that this is my first real typescript project. So sorry for the little bugs 😅