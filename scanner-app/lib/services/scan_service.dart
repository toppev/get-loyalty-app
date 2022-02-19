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

  /// New rewards the customer get from participating (i.e., enough stamps, new customer level)
  List<Map<String, Object>> newRewards;

  /// The reward that was used (confirmed GetScan), nullable
  List<Map<String, Object>> usedRewards;

  UseScan(this.message, this.newRewards, this.usedRewards);

  factory UseScan.fromJson(Map<String, dynamic> json) {
    return UseScan(
      json['message'],
      json['newRewards'],
      json['usedRewards'],
    );
  }

  Map<String, dynamic> toJson() => {
        'message': message,
        'newRewards': newRewards,
        'usedRewards': usedRewards,
      };
}

class ScanService {
  SessionService sessionService;

  ScanService(this.sessionService);

  /// Used to get information of the scanned string (i.e., the questions)
  Future<GetScan> getScanInfo(String scan) async {
    var url = '$backendUrl/scan/$scan';
    print('#getScan called. Sending request to $url');
    final response = await sessionService.get(url);
    if (response.statusCode == 200) {
      return GetScan.fromJson(response.data, scannedString: scan);
    } else {
      var body = response.data;
      throw ('${body['message'] ?? "HTTP status code: ${response.statusCode}"}');
    }
  }

  /// Used to "use the reward or campaign" (i.e., answer the questions of the scan)
  Future<UseScan> useScan(String scan, List<Question> answers) async {
    var url = '$backendUrl/scan/$scan';
    final bodyJson = jsonEncode({'answers': answers});
    print('#useScan called. Sending request to $url, body: $bodyJson');
    final response = await sessionService.post(url, bodyJson);
    if (response.statusCode == 200) {
      return UseScan.fromJson(response.data);
    } else {
      var body = response.data;
      throw ('${body['message'] ?? "HTTP status code: ${response.statusCode}"}');
    }
  }
}
