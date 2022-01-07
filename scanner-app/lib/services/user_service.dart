import 'dart:convert';

import 'package:dio/dio.dart';

import 'session_service.dart';

class UserCredentials {
  String password;
  String email;

  UserCredentials(this.email, this.password);

  Map<String, dynamic> toJson() => {
        'email': email,
        'password': password,
      };
}

class UserService {
  SessionService sessionService;

  UserService(this.sessionService);

  /// Login using the credentials.
  /// Returns the profile or throws an error
  Future<dynamic> login(UserCredentials credentials) async {
    await _getServer(credentials.email);
    final url = '$backendUrl/user/login';
    print('#login() called. Sending request to $url');
    final response = await sessionService.post(url, json.encode(credentials));
    return _handleUserResponse(response);
  }

  _getServer(String email) async {
    print('#getServer() called. Getting the backend URL from $SERVER_API_URL');
    final res = await sessionService.post("$SERVER_API_URL/server/get_or_create/?create=false", json.encode({'email': email}));
    if (res.statusCode != 200) {
      throw "HTTP status code: ${res.statusCode}. Body: ${res.data}";
    }
    var body = res.data;
    print(body);
    backendUrl = body['staticAPIAddress'];
    print('backendUrl set to $backendUrl');
    sessionService.saveValues();
  }

  /// Tries to fetch the current user.
  /// Returns the profile or null
  Future<dynamic> profile() async {
    final url = '$backendUrl/user/profile';
    print('#profile() called. Sending request to $url');
    final response = await sessionService.get(url);
    return _handleUserResponse(response);
  }

  Future<dynamic> logout() async {
    final url = '$backendUrl/user/logout';
    print('#logout() called. Sending request to $url');
    try {
      final response = await sessionService.post(url, {});
      return _handleUserResponse(response);
    } catch (e, stacktrace) {
      print("failed to log out $e: $stacktrace");
    } finally {
      await sessionService.logout();
    }
  }

  _handleUserResponse(Response response) {
    if (response.statusCode >= 200 && response.statusCode <= 300) {
      var body = response.data;
      if (body['businessOwner'] != null) {
        return body;
      }
      throw 'No businesses found. Is it wrong account?';
    } else {
      var body = response.data;
      throw ('${body['message'] ?? "HTTP status code: ${response.statusCode}.Body: $body"}');
    }
  }
}
