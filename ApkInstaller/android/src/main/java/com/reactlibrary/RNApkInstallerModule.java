
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.Context;
import android.content.ContextWrapper;
import android.os.Build;
import android.Manifest;
import android.os.Environment;
import androidx.core.content.FileProvider;
import java.io.File;
public class RNApkInstallerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNApkInstallerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNApkInstaller";
  }

  @ReactMethod
  public void installApk(String apkFilePath,
                         Callback successCallback,
                         Callback errorCallback) {
    try {
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setDataAndType(Uri.fromFile(new File(apkFilePath)), "application/vnd.android.package-archive");
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
      intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        String authority=reactContext.getApplicationContext().getPackageName();
        Uri apkUri = FileProvider.getUriForFile(reactContext, authority+ ".fileprovider", new File(apkFilePath));
        // 请求读取权限
        reactContext.grantUriPermission(authority, apkUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);

        intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        successCallback.invoke("安装成功"); // 调用成功回调并返回成功消息
      }

      reactContext.startActivity(intent);
    } catch (Exception e) {
      errorCallback.invoke("安装失败"); // 调用错误回调并返回失败消息
      e.printStackTrace();
    }
  }

}