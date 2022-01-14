import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:loyalty_scanner_app/services/scan_service.dart';

import '../services/scan_service.dart';

class QuestionDialogWidget extends StatefulWidget {
  final List<Question> questions;
  final ValueChanged<List<Question>> onSubmit;

  /// All data. E.g "user", "reward", "campaigns"
  final Map<String, Object> data;

  const QuestionDialogWidget({
    Key key,
    this.onSubmit,
    this.questions,
    this.data = const {},
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => _QuestionDialogWidgetState();
}

class _QuestionDialogWidgetState extends State<QuestionDialogWidget> {
  Map<Question, List<String>> answers;

  @override
  void initState() {
    super.initState();
    answers = new Map.fromIterable(widget.questions, key: (v) => v, value: (v) => new List<String>());
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: dialogContent(context),
    );
  }

  dialogContent(BuildContext context) {
    Map<String, Object> user = widget.data['user'];
    user ??= {};
    final userInfoEl = Padding(
        padding: const EdgeInsets.only(right: 12, top: 12),
        child: Align(
          alignment: Alignment.topRight,
          child: DefaultTextStyle(
            style: TextStyle(color: Colors.black54, fontSize: 16),
            child: Column(children: [
              Text(
                'UserID: ${user['id']}',
                textAlign: TextAlign.end,
              ),
            ]),
          ),
        ));

    List<Widget> children = [userInfoEl];
    children.addAll(widget.questions.map((e) => renderQuestion(e)).toList());

    return SingleChildScrollView(child: Column(mainAxisAlignment: MainAxisAlignment.start, children: children));
  }

  Widget renderQuestion(Question question) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Flexible(
                  child: Text(
                question.question,
                overflow: TextOverflow.fade,
                style: TextStyle(fontSize: 36),
              )),
            ],
          ),
          Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: question.options.map((e) {
                return renderOption(e, question);
              }).toList())
        ],
      ),
    );
  }

  /// Lowercase strings that have a negative meaning
  static const negativeStrings = ['no', 'false', 'not'];

  Widget renderOption(String option, Question question) {
    var isAnswer = answers[question]?.contains(option);
    var negativeAnswer = negativeStrings.contains(option?.toLowerCase());

    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: RaisedButton(
        color: isAnswer
            ? negativeAnswer
                ? Colors.redAccent
                : Colors.green
            : Colors.white70,
        onPressed: () {
          setState(() {
            if (isAnswer) {
              answers[question].remove(option);
            } else {
              answers[question].add(option);
            }
            if (question == widget.questions.last) {
              var res = answers.entries.map((entry) => Question(entry.key.id, entry.key.question, entry.value)).toList();
              widget.onSubmit(res);
            }
          });
        },
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Text(option ?? '<invalid>', style: TextStyle(fontSize: 36)),
        ),
      ),
    );
  }
}
