
# react-native-apk-installer

## Getting started

`$ npm install react-native-apk-installer --save`

### Mostly automatic installation

`$ react-native link react-native-apk-installer`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-apk-installer` and add `RNApkInstaller.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNApkInstaller.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNApkInstallerPackage;` to the imports at the top of the file
  - Add `new RNApkInstallerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-apk-installer'
  	project(':react-native-apk-installer').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-apk-installer/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-apk-installer')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNApkInstaller.sln` in `node_modules/react-native-apk-installer/windows/RNApkInstaller.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Apk.Installer.RNApkInstaller;` to the usings at the top of the file
  - Add `new RNApkInstallerPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNApkInstaller from 'react-native-apk-installer';

// TODO: What to do with the module?
RNApkInstaller;
```
  