# Commonlands

![Commonlands app logo](./src/images/logoColor.png)

## Requirements

-   Android Studio: https://developer.android.com/studio
-   Ndk 21.4.7075529 on Android Studio
-   rustc 1.61.0 https://www.rust-lang.org/tools/install

### Install maven library

-   Follow this link https://www.digitalocean.com/community/tutorials/install-maven-mac-os

### Install

-   At root folder run:

    ```sh
    npm install
    ```

-   Go to `/node_modules/pbkdf2/browser.js` add line `var process = require("process");`

    ```diff
    + var process = require("process");
    ```

-   Go to `/node_modules/cipher-base/index.js` change `var Transform = require('stream').Transform` to `var Transform = require('readable-stream').Transform`

    ```diff
    - var Transform = require('stream').Transform
    + var Transform = require('readable-stream').Transform
    ```

### Install bip39

-   At root folder

    ```sh
    npm i --save-dev tradle/rn-nodeify
    ./node_modules/.bin/rn-nodeify --hack --install
    ```

### Fix library error

-   Go to `/node_modules/react-native-qr-decode-image-camera/android/build.gradle`, change minSdkVersion from 23 to 21

    ```diff
    - minSdkVersion 23
    + minSdkVersion 21
    ```

-   Go to `/node_modules/react-native-fetch-blob/android/build.gradle`, change compile to implementation

    ```diff
    - compile 'com.facebook.react:react-native:+'
    + implementation 'com.facebook.react:react-native:+'
    ```

-   If you encounter [`this error`](https://stackoverflow.com/questions/62275596/undefined-is-not-an-object-evaluating-process-version-split-in-react-native) go to `/node_modules/readable-stream/lib/_stream_writable.js`, change as following

    ```diff
    /*<replacement>*/
    var util = require('core-util-is');
    util.inherits = require('inherits');
    + var process = require("process");   // THIS LINE
    /*</replacement>*/
    ```
    and go to `/node_modules/browserify-sign/node_modules/readable-stream/lib/_stream_writable.js`, change as following
    ```diff
    /*<replacement>*/

    + var process = require("process");   // THIS LINE
    var pna = require('process-nextick-args');
    /*</replacement>*/
    ```
### Install rust

-   Follow this link https://www.rust-lang.org/tools/install
-   At root folder

    ```sh
    rustup target add armv7-linux-androideabi
    rustup target add aarch64-linux-android
    rustup target add x86_64-linux-android
    ```

### Add map client file

-   Clone commonlands-client repo to another folder

    ```sh
    git clone <repo-url>
    cd commonlands-client
    ```

-   Build the client

    ```sh
    npm run build
    ```

-   Then copy the `index.html` file from `commonlands-client/build` to [`android/app/src/main/assets/www`](./android/app/src/main/assets/www) folder

## Build

-   Open Android studio -> Create Android Emulator
-   At root folder

    ```sh
    npm run android
    ```

## Build apk

At root folder, run

```sh
npm run android:apk
```

If you have any error, please run below command at `android` folder

```sh
./gradlew clean app:assembleRelease -x bundleReleaseJsAndAssets
```

## Patch package

If a package has a bug and you want to fix it, you can use `patch-package` to modify the package in `node_modules` folder. Follow below steps:

-   Modify the package in `node_modules` folder
-   Run below command

    ```sh
    npx patch-package <package-name>
    ```

To apply the patch, run below command

```sh
npx patch-package
```

> Note: Please run `npm run android:clean` before run `npx patch-package ...` or before re-install packages

## Error encounter
if you are encounter this error during app development like [`this`](https://stackoverflow.com/questions/77088464/failed-to-construct-transformer-error-error0308010cdigital-envelope-routines), please change the line in /android/gradle/wrapper/gradle-wrapper.properties

`distributionUrl=https\://services.gradle.org/distributions/gradle-7.4-all.zip` to `distributionUrl=https\://services.gradle.org/distributions/gradle-7.6-all.zip`
