import 'dart:convert';

import 'package:http/http.dart' as http;

const BASE_URL = "http://localhost:3000";

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
  Future<http.Response> login(UserCredentials credentials) async {
    final url = '$BASE_URL/user/login';
    print('#login() called. Sending request to $url');
    final response = await http.post(url, body: json.encode(credentials));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      return json.decode(response.body);
    } else {
      var body = json.decode(response.body);
      throw ('${body.message != null ? body.message : "HTTP status code: ${response.statusCode}"}');
    }
  }
}
