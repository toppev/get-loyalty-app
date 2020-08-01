import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

const SERVER_API_URL = "https://api.getloyalty.app/server";
const BACKEND_KEY = "backend_url";
var backendUrl = ""; // http://10.0.2.2:3001 for localhost:3001

class SessionService {
  final storage = new FlutterSecureStorage();

  // Stored values
  Map<String, String> values;

  // Generated headers, not stored
  Map<String, String> headers = {'content-type': 'application/json'};

  SessionService() {
    storage.readAll().then((stored) {
      values = stored;
      backendUrl = values[BACKEND_KEY];
      values.remove(BACKEND_KEY);
      headers['cookie'] = _generateCookieHeader();
    });
  }

  Future<Response> get(String url) async {
    http.Response response = await http.get(url, headers: headers);
    print('headers $headers');
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print('Request to $url failed with status code ${response.statusCode}, '
          'response body: ${response.body}');
    }
    _updateCookie(response);
    return response;
  }

  Future<Response> post(String url, dynamic data) async {
    http.Response response = await http.post(url, body: data, headers: headers);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print('Request to $url failed with status code ${response.statusCode}, '
          'response body: ${response.body}');
    }
    _updateCookie(response);
    return response;
  }

  _saveValues() async {
    values.forEach((key, value) async {
      await storage.write(key: key, value: value);
    });
    print('Saved $values in client storage');
    await storage.write(key: BACKEND_KEY, value: backendUrl);
    print('Saved backendUrl ($backendUrl) in client storage ($BACKEND_KEY)');
  }

  // Stolen from https://stackoverflow.com/a/53991733

  /// Updates the cookies, stores them and generates a new 'cookie' header in
  void _updateCookie(http.Response response) {
    String allSetCookie = response.headers['set-cookie'];
    if (allSetCookie != null) {
      var setCookies = allSetCookie.split(',');
      for (var setCookie in setCookies) {
        var cookies = setCookie.split(';');
        for (var cookie in cookies) {
          _setCookie(cookie);
        }
      }
      _saveValues();
      headers['cookie'] = _generateCookieHeader();
      // Put 'XSRF-TOKEN' cookie in 'xsrf-token' header
      final csrf = values['XSRF-TOKEN'];
      if (csrf != null) {
        headers['xsrf-token'] = csrf;
      }
    }
  }

  /// Store a cookie in #values map
  void _setCookie(String rawCookie) {
    if (rawCookie.length > 0) {
      var keyValue = rawCookie.split('=');
      if (keyValue.length == 2) {
        var key = keyValue[0].trim();
        var value = keyValue[1];
        if (key.toLowerCase() != 'path' && key.toLowerCase() != 'expires') {
          values[key] = value;
        }
      }
    }
  }

  /// Generate the cookie header from #values map
  String _generateCookieHeader() {
    String cookie = "";
    for (var key in values.keys) {
      if (cookie.length > 0) cookie += ";";
      cookie += key + "=" + values[key];
    }
    return cookie;
  }
}
