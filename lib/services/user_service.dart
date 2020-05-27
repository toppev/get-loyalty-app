import 'dart:convert';

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

  Future<dynamic> login(UserCredentials credentials) async {
    final url = '$BASE_URL/user/login';
    print('#login() called. Sending request to $url');
    final response = await sessionService.post(url, json.encode(credentials));
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
