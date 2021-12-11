import 'package:flutter/material.dart';

void showError(context, {String message, String error}) {
  print('Opening error. message: $message, error: $error');
  showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(title: Text("An error occurred"), content: Text(message), actions: [
          error == null
              ? Text("")
              : new TextButton(
                  child: Text("Show Error"),
                  onPressed: () {
                    Navigator.of(context).pop();
                    showError(context, message: error);
                  },
                ),
          new TextButton(
            child: Text("Close"),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ]);
      });
}
