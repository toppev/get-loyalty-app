import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'services/scan_service.dart';

class QuestionDialogWidget extends StatefulWidget {
  final List<Question> questions;
  final ValueChanged<List<Question>> onSubmit;

  const QuestionDialogWidget({
    Key key,
    this.questions,
    this.onSubmit,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => _QuestionDialogWidgetState();
}

class _QuestionDialogWidgetState extends State<QuestionDialogWidget> {
  Map<Question, List<String>> answers;

  @override
  void initState() {
    super.initState();
    answers =
        new Map.fromIterable(widget.questions, key: (v) => v, value: (v) => new List<String>());
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: dialogContent(context),
    );
  }

  dialogContent(BuildContext context) {
    return SingleChildScrollView(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: widget.questions.map((e) => renderQuestion(e)).toList()));
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

  Widget renderOption(String option, Question question) {
    var isAnswer = answers[question] != null && answers[question].contains(option);
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: RaisedButton(
        color: isAnswer ? Colors.green : Colors.white70,
        onPressed: () {
          setState(() {
            if (isAnswer) {
              answers[question].remove(option);
            } else {
              answers[question].add(option);
            }
            if (question == widget.questions.last) {
              var res = answers.entries
                  .map((entry) => Question(entry.key.id, entry.key.question, entry.value))
                  .toList();
              widget.onSubmit(res);
            }
          });
        },
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Text(option, style: TextStyle(fontSize: 36)),
        ),
      ),
    );
  }
}
