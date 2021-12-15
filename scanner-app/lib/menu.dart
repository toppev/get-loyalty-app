import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'login.dart';
import 'main.dart';
import 'services/user_service.dart';

class MenuActions {
  static const String Logout = 'Logout';

  static const List<String> choices = <String>[Logout];
}

class MenuWidget extends StatelessWidget {
  const MenuWidget({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var userService = Provider.of<UserService>(context);
    void choiceAction(String choice) async {
      if (choice == MenuActions.Logout) {
        print('Logging out');
        await userService.logout();
        Navigator.of(context).pushReplacement(MaterialPageRoute(
            builder: (context) => LoginPage(
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
