import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'login.dart';
import 'main.dart';
import 'services/session_service.dart';

class MenuActions {
  static const String Logout = 'Logout';

  static const List<String> choices = <String>[Logout];
}

class MenuWidget extends StatelessWidget {
  const MenuWidget({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var sessionService = Provider.of<SessionService>(context);
    void choiceAction(String choice) {
      if (choice == MenuActions.Logout) {
        print('Logging out');
        sessionService.storage.deleteAll();
        sessionService.headers.clear();
        sessionService.values.clear();
        Navigator.of(context).pushReplacement(MaterialPageRoute(
            builder: (context) =>
                LoginPage(
                  title: APP_TITLE,
                )));
      }
    }

    return PopupMenuButton<String>(
      onSelected: choiceAction,
      itemBuilder: (BuildContext context) {
        return MenuActions.choices.map((String choice) {
          return PopupMenuItem<String>(
            value: choice,
            child: Text(choice),
          );
        }).toList();
      },
    );
  }
}
