import 'dart:convert';

import 'package:loyalty_scanner_app/services/session_service.dart';

class GetScan {
  dynamic reward;
  String scannedString;
  List<dynamic> campaigns;
  List<Question> questions;
  Map<String, Object> user;

  GetScan(this.reward, this.campaigns, this.questions, {this.scannedString, this.user});

  factory GetScan.fromJson(Map<String, dynamic> json, {scannedString}) {
    List<Question> questions = json['questions'].map<Question>((e) => Question.fromJson(e)).toList();

    return GetScan(
      json['rewards'],
      json['campaigns'],
      questions,
      scannedString: scannedString,
      user: json['user'],
    );
  }

  Map<String, dynamic> toJson() => {
        'reward': reward,
        'campaigns': campaigns,
        'questions': questions.map((e) => e.toJson()),
        'user': user,
      };
}

/// Question or answer
class Question {
  dynamic id;
  String question;

  /// Also used as answers
  List<String> options;

  Question(this.id, this.question, this.options);

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      json['id'],
      json['question'],
      json['options'].cast<String>().toList(),
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
  dynamic usedReward;

  UseScan(this.message, this.newRewards, this.usedReward);

  factory UseScan.fromJson(Map<String, dynamic> json) {
    return UseScan(
      json['message'],
      json['newRewards'],
      json['usedReward'],
    );
  }

  Map<String, dynamic> toJson() => {
        'message': message,
        'newRewards': newRewards,
        'usedReward': usedReward,
      };
}

class ScanService {
  SessionService sessionService;

  ScanService(this.sessionService);

  Future<GetScan> getScan(String scan) async {
    var url = '$backendUrl/scan/$scan';
    print('#getScan called. Sending request to $url');
    final response = await sessionService.get(url);
    if (response.statusCode == 200) {
      return GetScan.fromJson(json.decode(response.body), scannedString: scan);
    } else {
      var body = json.decode(response.body);
      throw ('${body['message'] ?? "HTTP status code: ${response.statusCode}"}');
    }
  }

  Future<UseScan> useScan(String scan, List<Question> answers) async {
    var url = '$backendUrl/scan/$scan';
    final bodyJson = jsonEncode({'answers': answers});
    print('#useScan called. Sending request to $url, body: $bodyJson');
    final response = await sessionService.post(url, bodyJson);
    if (response.statusCode == 200) {
      return UseScan.fromJson(json.decode(response.body));
    } else {
      var body = json.decode(response.body);
      throw ('${body['message'] ?? "HTTP status code: ${response.statusCode}"}');
    }
  }
}
