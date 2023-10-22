package com.reactlibrary;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class PushNotificationModule extends ReactContextBaseJavaModule {
    private static final int NOTIFICATION_ID = 1;
    private static final int MAX_PROGRESS = 100;
    private int currentProgress = 0;
    private NotificationCompat.Builder notificationBuilder;
    private NotificationManager notificationManager;

    private  Context _reactContext;
    public PushNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //ReactActivity currentActivity = (ReactActivity) getCurrentActivity();
        this._reactContext=reactContext;//currentActivity;

    }

//
    @ReactMethod
    public void localNotification(ReadableMap notificationParams) {
        try {
            Log.d("PushNotificationModule", "进入localNotification!");

            ReadableMap progress=notificationParams.getMap("progress");
            int id=notificationParams.getInt("id");
        int max=progress.getInt("max");
        int p=(int)progress.getDouble("progress");
        boolean indeterminate=progress.getBoolean("indeterminate");
        String message=notificationParams.getString("message");
        String title=notificationParams.getString("title");
        String channelId= notificationParams.getString("channelId");
        Log.d("PushNotificationModule", "Received localNotification with progress: " + p);

        //String percent=String.valueOf(  p) +"%";
            //int p=1;
        // NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationCompat.Builder   mBuilder =
                new NotificationCompat.Builder(_reactContext, channelId)
                        .setSmallIcon(android.R.drawable.ic_notification_overlay)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setProgress(max, p, indeterminate);


                    notificationManager.notify(id, mBuilder.build());
        } catch (Exception e) {
            Log.e("PushNotificationModule", "Error in localNotification: " + e.getMessage(), e);
        }
    }

    

    @ReactMethod
    public void hideNotification(ReadableMap channelConfig, Callback callback) {
          int id = channelConfig.getInt("id");
        String channelId=channelConfig.getString("channelId");
        notificationManager.cancel(id);
    }


    // 创建和注册通知渠道
    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannel(ReadableMap channelConfig, Callback callback) {
        try {
            Log.d("PushNotificationModule", "进入createNotificationChannel" );
//        String channelId = "default";
//        String channelName = "YourChannelName";
//        String channelDescription = "YourChannelDescription";
        // 解析通道配置
        String channelId = channelConfig.getString("channelId");
        String channelName = channelConfig.getString("channelName");
        String channelDescription = channelConfig.getString("channelDescription");
        boolean playSound = channelConfig.getBoolean("playSound");
        boolean vibrate = channelConfig.getBoolean("vibrate");

        int channelImportance = NotificationManager.IMPORTANCE_LOW; // 设置通知渠道的重要性


        NotificationChannel channel = new NotificationChannel(channelId, channelName, channelImportance);
        channel.setDescription(channelDescription);
        channel.enableVibration(vibrate);
        notificationManager = (NotificationManager) _reactContext.getSystemService(Context.NOTIFICATION_SERVICE);

        // NotificationManager notificationManager = getSystemService(NotificationManager.class);
        notificationManager.createNotificationChannel(channel);

        // 返回通道创建状态给 React Native
        WritableMap result = Arguments.createMap();
        result.putBoolean("created", true);
        callback.invoke(result);
        Log.d("PushNotificationModule", "Received localNotification 成功" );

        } catch (Exception e) {
        Log.e("PushNotificationModule", "错误 in createNotificationChannel: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public  void createChannel(ReadableMap channelConfig, Callback callback)
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel(channelConfig,callback);
        }
    }

    @Override
    public String getName() {
        return "PushNotification";
    }
/*
    @ReactMethod
    public void showProgressNotification() {
       // notificationManager = (NotificationManager) _reactContext.getSystemService(Context.NOTIFICATION_SERVICE);

        notificationBuilder = new NotificationCompat.Builder(_reactContext, "default")
                .setSmallIcon(android.R.drawable.ic_notification_overlay)
                .setContentTitle("下载进度")
                //.setOngoing(true)
                //.setOnlyAlertOnce(true)
                .setProgress(MAX_PROGRESS, 1, false);

        // 使用反射来获取 MainActivity 类
        try {
            Class<?> mainActivityClass = Class.forName(_reactContext.getPackageName() + ".MainActivity");
            Intent intent = new Intent(_reactContext, mainActivityClass);
            PendingIntent pendingIntent = PendingIntent.getActivity(_reactContext, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            notificationBuilder.setContentIntent(pendingIntent);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        notificationManager.notify(NOTIFICATION_ID, notificationBuilder.build());
    }

    @ReactMethod
    public void updateProgress(int progress) {
        if (progress > currentProgress) {
            currentProgress = progress;
            notificationBuilder.setProgress(MAX_PROGRESS, currentProgress, false);
            notificationManager.notify(NOTIFICATION_ID, notificationBuilder.build());
        }
    }


    @ReactMethod
    public void hideProgressNotification() {
        notificationBuilder.setProgress(0, 0, false);
        notificationBuilder.setContentText("下载完成");
        notificationManager.notify(NOTIFICATION_ID, notificationBuilder.build());
    }

 */
}
