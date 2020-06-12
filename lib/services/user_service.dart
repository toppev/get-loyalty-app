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
    final url = '$BASE_URL/user/login';
    print('#login() called. Sending request to $url');
    final response = await sessionService.post(url, json.encode(credentials));
    return _handleUserResponse(response);
  }

  /// Tries to fetch the current user.
  /// Returns the profile or null
  Future<bool> profile() async {
    final url = '$BASE_URL/user/profile';
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
        sessionService.setBusiness(business);
        return body;
      }
      throw 'No businesses found';
    } else {
      var body = json.decode(response.body);
      throw ('${body['message'] != null ? body['message'] : "HTTP status code: ${response.statusCode}"}');
    }
  }
}
