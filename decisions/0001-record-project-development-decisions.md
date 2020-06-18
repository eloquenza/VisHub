- Feature Name: record-project-development-decision

# 1. Record informations about decisions made for development

## Status
[status]: #status

Accepted

## Context
[context]: #context

Recording informations about the decisions taken for the development of this project helps to remember why I have done something.

## Decision
[decision]: #decision

Programming language: Typescript
Package manager: yarn (npm should work too)
Frontend framework: React
Visualization framework: d3

Project initialization will be done via create-react-app, see install.md for more.

## Consequences, rationale and alternatives
[consequences]: #consequences

While I preferred to have programmed this in C++ or another, compiled and otherwise not to JavaScript-related language, I have decided against this idea due to that I am unable to test the application on macOS which I think our professor uses.
Because I am not a good JavaScript programmer and cling to types, especially when I am using an programming environment that I am unfamiliar with, I have chosen to use Typescript as the language is easily transpiled back to JS.

## Unresolved questions
[unresolved-questions]: #unresolved-questions

None currently. 
