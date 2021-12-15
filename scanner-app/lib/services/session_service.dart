import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/adapter_browser.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const SERVER_API_URL = "https://api.getloyalty.app/servers";
const BACKEND_KEY = "backend_url";
var backendUrl = ""; // http://10.0.2.2:3001 for localhost:3001

const _requestTimeout = Duration(seconds: 5);

class SessionService {
  final storage = new FlutterSecureStorage();
  var dio = Dio();

  // Stored values
  Map<String, String> values;

  init() async {
    var adapter = BrowserHttpClientAdapter();
    adapter.withCredentials = true;
    dio.httpClientAdapter = adapter;

    dio.interceptors.add(CookieManager(kIsWeb ? CookieJar() : PersistCookieJar()));
    values = await storage.readAll();

    backendUrl = values[BACKEND_KEY];
  }

  Future<Response> get(String url) async {
    final response = await dio.get(url).timeout(_requestTimeout);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print('Request to $url failed with status code ${response.statusCode}, '
          'response body: ${response.data}');
    }
    return response;
  }

  Future<Response> post(String url, dynamic data) async {
    final response = await dio.post(url, data: data).timeout(_requestTimeout);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print('Request to $url failed with status code ${response.statusCode}, '
          'response body: ${response.data}');
    }
    return response;
  }

  Future<dynamic> logout() async {
    backendUrl = "";
    values.clear();
    await saveValues();
  }

  saveValues() async {
    await values.forEach((key, value) async {
      await storage.write(key: key, value: value);
    });
    print('Saved ${values.keys} in client storage');
    await storage.write(key: BACKEND_KEY, value: backendUrl);
    print('Saved $BACKEND_KEY ($backendUrl) in client storage');
  }
}
