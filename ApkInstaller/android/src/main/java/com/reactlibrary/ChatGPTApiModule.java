
package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

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
import java.io.IOException;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.BufferedSource;

public class ChatGPTApiModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ChatGPTApiModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ChatGPTApiModule";
    }

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    @ReactMethod
    public void fetchData(String url, String json,String API_KEY, final Promise promise) {
        OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Authorization", "Bearer "+API_KEY)
                .build();

        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                promise.reject(e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                try (ResponseBody body = response.body()) {
                    BufferedSource source = body.source();
                    while (!source.exhausted()) {
                        String responseData = source.readUtf8Line();
                        // 在 React Native 中打印流式响应
                        //System.out.println(responseData);
                        sendResponseData(responseData);
                    }
                    promise.resolve(true);
                } catch (IOException e) {
                    promise.reject(e);
                }
            }
        });
    }

    private void sendResponseData(String responseData) {
        WritableMap params = Arguments.createMap();
        params.putString("responseData", responseData);

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onResponseData", params);
    }

    // Required for rn built in EventEmitter Calls.
    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }
}