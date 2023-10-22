using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Apk.Installer.RNApkInstaller
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNApkInstallerModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNApkInstallerModule"/>.
        /// </summary>
        internal RNApkInstallerModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNApkInstaller";
            }
        }
    }
}
