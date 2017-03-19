# Stock Charts: The Angular2 project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.32.

![Screenshot](screenshot.png?raw=true "Screenshot")

## Installation guide

 * npm install
 * ng build (may be failed because of known issue)
 * ng serve

## Known issues

Because of known bug in Angular CLI described here https://github.com/angular/angular-cli/issues/5117 and causing multiple compilation errors it's sometimes required to manually save one of the "root" files, for example `app.component.ts` in your IDE. It will trigger correct build of `ng serve`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
