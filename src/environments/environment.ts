// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  geminiApiKey: 'AIzaSyBxofSvMg3hrXTilGFS9Q18ROvD_0AOIz4',
  // Replace gemini-1.5-flash with a 2026-supported model
  geminiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
