import 'dart:convert';

import 'package:http/http.dart';

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
    final res = await sessionService.post(
        "$SERVER_API_URL/server/get_or_create/?create=false",
        json.encode({'email': email}));
    if (res.statusCode != 200) {
      throw "HTTP status code: ${res.statusCode}. Body: ${res.body}";
    }
    var body = json.decode(res.body);
    backendUrl = body['publicAddress'];
    print('backendUrl set to $backendUrl');
  }

  /// Tries to fetch the current user.
  /// Returns the profile or null
  Future<bool> profile() async {
    final url = '$backendUrl/user/profile';
    print('#profile() called. Sending request to $url');
    final response = await sessionService.get(url);
    if (response.statusCode == 200) {
      return _handleUserResponse(response);
    }
    return null;
  }

  _handleUserResponse(Response response) {
    if (response.statusCode >= 200 && response.statusCode <= 300) {
      var body = json.decode(response.body);
      var business = body['businessOwner'];
      if (business != null) {
        return body;
      }
      throw 'No businesses found';
    } else {
      var body = json.decode(response.body);
      throw ('${body['message'] != null ? body['message'] : "HTTP status code: ${response.statusCode}.Body: $body"}');
    }
  }
}
