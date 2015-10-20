## Running the local server

From the project root directory, run:
```shell
node styleguide/server.js
```

The styleguide will then be accessible at http://localhost:3000/

## Overriding Data

Overriding the viewmodel data in the styleguide works similar to the other assets (templates/less) except the paths that are used to resolve the viewmodel are different.

For example, to override the Base styleguide's `bsp-article` component's viewmodel located in:
```
/node_modules/brightspot-base/styleguide/components/bsp-article/
```
You would create the following file path in your project:
```
/styleguide/components/bsp-article/index.json
```
And then the styleguide would load your viewmodel when this URL is resolved:

http://localhost:3000/components/bsp-article/

### Resource Precedence

To provide developers a way to easily override, Base looks to resolve resources within your project's styleguide in the following order:
1. `/styleguide/`
2. `/node_modules/brightspot-base/styleguide/`
