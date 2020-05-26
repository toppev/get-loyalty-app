import 'dart:convert';

import 'package:http/http.dart' as http;

const BASE_URL = "http://localhost:3000";

class GetScan {
  dynamic reward;
  String scannedString;
  List<dynamic> campaigns;
  List<Question> questions;

  GetScan(this.reward, this.campaigns, this.questions, {this.scannedString});

  factory GetScan.fromJson(Map<String, dynamic> json, {scannedString}) {
    return GetScan(json['rewards'], json['campaigns'], json['questions'],
        scannedString: scannedString);
  }
}

/// Question or answer
class Question {
  dynamic id;
  String question;
  List<String> options; // also known as answers

  Question(this.id, this.question, this.options);

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      json['id'],
      json['question'],
      json['options'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'question': question,
        'options': options,
      };
}

class UseScan {
  String message;
  List<dynamic> newRewards;

  UseScan(this.message, this.newRewards);

  factory UseScan.fromJson(Map<String, dynamic> json) {
    return UseScan(
      json['message'],
      json['newRewards'],
    );
  }
}

class ScanService {
  Future<GetScan> getScan(String scan, String businessId) async {
    var url = '$BASE_URL/business/$businessId/scan/$scan';
    print('#getScan called. Sending request to $url');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      return GetScan.fromJson(json.decode(response.body), scannedString: scan);
    } else {
      var body = json.decode(response.body);
      throw ('${body.message != null ? body.message : "HTTP status code: ${response.statusCode}"}');
    }
  }

  Future<UseScan> useScan(
      String scan, String businessId, List<Question> answers) async {
    var url = '$BASE_URL/business/$businessId/scan/$scan';
    print('#useScan called. Sending request to $url');
    final response = await http.post(url, body: json.encode({answers}));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      var body = json.decode(response.body);
      throw ('${body.message != null ? body.message : "HTTP status code: ${response.statusCode}"}');
    }
  }
}
