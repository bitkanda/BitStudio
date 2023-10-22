package com.bitstudio;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BitStudio";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {

    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

//
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//      createNotificationChannel();
//    }
//    // 在这里调用 progressNotice 函数
//    progressNotice();
//
//    // ...其他代码...


  }

  // 创建和注册通知渠道
  @RequiresApi(api = Build.VERSION_CODES.O)
  private void createNotificationChannel() {
    String channelId = "default";
    String channelName = "YourChannelName";
    String channelDescription = "YourChannelDescription";
    int channelImportance = NotificationManager.IMPORTANCE_LOW; // 设置通知渠道的重要性
    boolean channelVibrate = false; // 禁用震动

    NotificationChannel channel = new NotificationChannel(channelId, channelName, channelImportance);
    channel.setDescription(channelDescription);
    channel.enableVibration(channelVibrate);

    NotificationManager notificationManager = getSystemService(NotificationManager.class);
    notificationManager.createNotificationChannel(channel);
  }

  public void progressNotice() {
    int p=1;
    NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      NotificationCompat.Builder   mBuilder =
               new NotificationCompat.Builder(this, "default")
                    .setSmallIcon(android.R.drawable.ic_notification_overlay)
                    .setContentTitle("下载进度")
                    //.setOngoing(true)
                    //.setOnlyAlertOnce(true)
                    .setProgress(100, p, false);


    // Start a lengthy operation in a background thread
    new Thread(new Runnable() {
      @Override
      public void run() {
        int progress;
        for (progress = 0; progress <= 100; progress++) {
          // Sets the progress indicator to a max value, the current completion percentage,
          // and determinate state
          mBuilder.setProgress(100, progress, false);

          //不明确进度的进度条
//                    mBuilder.setProgress(0, 0, true);

          nm.notify(4, mBuilder.build());
          // 模拟延时
          try {
            Thread.sleep(1000);
          } catch (InterruptedException e) {
            e.printStackTrace();
          }
        }

        // When the loop is finished, updates the notification
        mBuilder.setContentText("Download complete");
        // Removes the progress bar
        mBuilder.setProgress(0, 0, false);
        nm.notify(4, mBuilder.build());
      }
    }
    ).start();
  }
}
