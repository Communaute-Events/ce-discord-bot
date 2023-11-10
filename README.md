![Static Badge](https://img.shields.io/badge/built%20while%20sleep%20deprived-8A2BE2?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAArlBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAABAQECAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6+voAAAAAAABWVlb///+Kioqfn5/k5OT///////8AAAD///8BAQEICAgWFhYqKipVVVUgICBwcHAODg47OztEREQyMjJ+fn7Q0NBlZWVMTExqamphYWGhoaHv7++Pj4/d3d2ysrK8vLzAtKruAAAAIXRSTlMAyzPbBw4baUD1tqrpTXMl+pJhhftae/2h8GYeYG6PvN/1mIHfAAABoUlEQVRYw+2Vx3aDMBBF6c1U44LThaimg42d//+xQNzAiQHL52SRw12xeVfSjBhh2MjIyMhfQDEcq6CGaUXSBZLnOaQwMdVwUQUVdwuqXcsGvoIAzgCKgKt2DZrcK2DBFY8IoB36sf/6jCSAdpBvkq1pmsuP97cXTqHvEayj9BCu2X7Ggc2LgjblGGqQICrPYXO3zyPrdKQVKehzgu4TeMkxvNxtCsdqFhQCMBNxY051CvxDOildD4Jf4aVOQVnn95l9I13DdgqcMlnuvNtpYIdPPV2ws9iN1jfi69B12L42QsvLUrddwANWUFRdkYfcRMtx82uHFaRhvbNBAgDhOkj97NIKGOWu/f3VJZjCq4L5/rEhTl6cSrvoEfBi8/J4buyHtpf6ztndJZCqMWQQOtk6ulPEcdAoR5eA1shJNUYVGZ+1mneKq2rPRcKw4y/HTAX+ZxtJVuchPnBQ09JEbMfVCYFR0pwZPmAJjWwtT98/4JUFDi/LI8Gw+Hc7dRr5gZtDlAemeTfqjooEuoCpz6BR6AKMMASZxh6CwkZGRv4/XzbvWiNq+LZnAAAAAElFTkSuQmCC)

# Discord Dev Env ⭐

This template serves the purpose of making the developpement of discord bots less tedious. It is shipped with many features like a .yaml config loader and other cool things.

## Features

The most important features are:
- Working Path Aliases
    > No more `../../folder/file.txt` in your imports! You can now define path aliases in the `tsconfig.json` file so you can import your files like `@src/folder/file`.
- YAML Config Loader
    > There's a global function available named `loadYaml()`. In the config, you can specify a path from where to load files from.
    > Example:
    ```javascript
    const config = loadYaml("admins.yml")
    console.log(config)

    // Output: { origaming: "cool", you: "awesome!" }
    ```

There's also utilites functions (`@src/core/utilites.ts`)
- ANSI color formatting
    ```javascript
    console.log(ansi("%yellow%This message is yellow!%end%"))
    ```
    > You can see and add more colors by peeking into the file.
- Logging function
    > Simple logging with colors (info, warn, error, success, minimal)
    ```javascript
    logging(`Exception Occuured: ${error}`,"error")
    ```

More features will come in the future!

### Examples

There's some example commands in `@src/commands`

### Contributing

Feel free to open issues, PRs, etc... I'm not very familiar with git so I may take a little bit of time to accept your changes. Please note that this is my first real typescript project. So sorry for the little bugs 😅
