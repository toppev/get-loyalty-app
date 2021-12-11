import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

const SERVER_API_URL = "https://api.getloyalty.app/servers";
const BACKEND_KEY = "backend_url";
var backendUrl = ""; // http://10.0.2.2:3001 for localhost:3001

const Map<String, String> _defaultHeaders = {'content-type': 'application/json'};

const _requestTimeout = Duration(seconds: 5);

class SessionService {
  final storage = new FlutterSecureStorage();

  // Stored values
  Map<String, String> values;

  // Generated headers, not stored
  Map<String, String> headers = {};

  SessionService() {
    storage.readAll().then((stored) {
      values = stored;
      backendUrl = values[BACKEND_KEY];
      values.remove(BACKEND_KEY);
      headers['cookie'] = _generateCookieHeader();
    });
  }

  init() async {
    values = await storage.readAll();
    backendUrl = values[BACKEND_KEY];
    values.remove(BACKEND_KEY);
    headers['cookie'] = _generateCookieHeader();
  }

  _getHeaders() => {..._defaultHeaders, ...headers};

  Future<Response> get(String url) async {
    final response = await http.get(Uri.parse(url), headers: _getHeaders()).timeout(_requestTimeout);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      print('Request to $url failed with status code ${response.statusCode}, '
          'response body: ${response.body}');
    }
    _updateCookie(response);
    return response;
  }

  Future<Response> post(String url, dynamic data) async {
    final response = await http.post(Uri.parse(url), body: data, headers: _getHeaders()).timeout(_requestTimeout);
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
    print('Saved ${values.keys} in client storage');
    await storage.write(key: BACKEND_KEY, value: backendUrl);
    print('Saved $BACKEND_KEY ($backendUrl) in client storage');
  }

  // Stolen from https://stackoverflow.com/a/53991733

  /// Updates the cookies, stores them and generates a new 'cookie' header in
  void _updateCookie(http.Response response) {
    final allSetCookie = response.headers['set-cookie'];
    if (allSetCookie != null) {
      var setCookies = allSetCookie.split(',');
      for (var setCookie in setCookies) {
        // Ignore path, expires and domain (for now)
        _setCookie(setCookie.split(';')[0]);
      }
      _saveValues();
      headers['cookie'] = _generateCookieHeader();
    }
  }

  /// Store a cookie in #values map
  void _setCookie(String rawCookie) {
    if (rawCookie.length > 0) {
      // Split at first '='
      var sepIndex = rawCookie.indexOf('=');
      if (sepIndex == -1) return;
      var keyValue = [rawCookie.substring(0, sepIndex), rawCookie.substring(sepIndex + 1)];
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
    var cookie = "";
    for (var key in values.keys) {
      if (cookie.length > 0) cookie += ";";
      cookie += key + "=" + values[key];
    }
    return cookie;
  }
}
