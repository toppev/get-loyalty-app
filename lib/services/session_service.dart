import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

const BASE_URL = "http://10.0.2.2:3001";

class SessionService {
  final storage = new FlutterSecureStorage();

  // Stored values
  Map<String, String> values;

  // Generated headers, not stored
  Map<String, String> headers = {'content-type': 'application/json'};

  SessionService() {
    storage.readAll().then((value) {
      values = value;
      headers['cookie'] = _generateCookieHeader();
    });
  }

  getBusinessUrl() => '$BASE_URL/business/${values['businessId']}';

  setBusiness(String businessId) {
    values['businessId'] = businessId;
    _saveValues();
  }

  Future<Response> get(String url) async {
    http.Response response = await http.get(url, headers: headers);
    print('headers $headers');
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print(
          'Request to $url returned status code ${response.statusCode}, response body: ${response.body}');
    }
    _updateCookie(response);
    return response;
  }

  Future<Response> post(String url, dynamic data) async {
    http.Response response = await http.post(url, body: data, headers: headers);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print(
          'Request to $url returned status code ${response.statusCode}, response body: ${response.body}');
    }
    _updateCookie(response);
    return response;
  }

  _saveValues() {
    values.forEach((key, value) async {
      await storage.write(key: key, value: value);
    });
  }

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
  // TODO: don't include businessId in cookie headers
  String _generateCookieHeader() {
    String cookie = "";
    for (var key in values.keys) {
      if (cookie.length > 0) cookie += ";";
      cookie += key + "=" + values[key];
    }
    return cookie;
  }
}
