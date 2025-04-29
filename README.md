# Github Explorer APP

Demonstration screen recording : <https://1drv.ms/v/s!ApBIzeB8f5mmqnY9a_dqlmyju-4b?e=aSJEya>

The Url seems suspicious but it is Microsoft Onedrive that gives this

## Architecture

### Frontend app

The main file App.tsx is start point for React.

It includes a provider for services needed by components, acting like a dependency injection. It uses React Context.

The navigation routing is in navigation/index.tsx, and the screens in the respective directory.

The screens are in separate folders, with a file for UI and a file for the screen logic, declared as a React custom hook, to follow single responsibility principle.

Common or Reusable components are kept in src/components.

The API services or utility services are kept in src/services.

They are declared as classes so the dependencies can be injected when testing. (excepted the AuthService, heavily depending on Expo)

### Server

For now, it is a simple http server with Fastify in one single file without typescript, to be faster in development.

## What has been done

1. The recommended Oauth approach by expo was used to authenticate users with GitHub.
2. The device flow could also be used as in Github Documentation, but it seems to be less a standard approach and there would be need to use custom auth flow, without expo-auth-session. It could be done, but needs more time.
3. The auth tokens are not kept in React context, due to the complexity of sync between secure store and context.

## What could be done given more time

1. Would have used NestJS Framework for backend with Typescript.
2. Auth with GitLab
3. Common exception handling in services
4. GraphQL requests to github api
5. Better typescript & prettier configuration
6. Payload validation, with zod or yup
7. Add some translations, internationalization
8. Added some UI component styling library or created common style
9. Custom hooks for common logic in screen
10. Run CI on commit (eslint, prettier, typescript, tests...)
11. Put e2e test runner Maestro in Docker as in their docs

## Scalability architecture

1. Standard Oauth flow is used with a custom backend rest api, so server can be scaled horizontally.
2. The screen logic is separated from the screen UI, so there is single responsibility principle.
3. Frontend services are passed down with react context, so they can be easily replaced with mock services for testing, and they are all instantiated in the same place, with their dependencies & configurations.
4. There is the GitProviderService interface, so it can be easily replaced with another service, like GitLab or Bitbucket.

## Trade-offs made to meet time constraints

1. No React native Web support yet, it was not tested on web, it would need to have a logic of keeping auth tokens in react context.
2. Basic interface, no animations or transitions, default icons...
3. Some code was suggested by AI autocompletion. (is it a trade-off?)
4. Used Expo for react native instead of bare react native
