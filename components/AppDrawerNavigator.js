import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from "./AppTabNavigator";
import SettingsScreen from '../screens/SettingsScreen';
import CustomSideBarMenu from './CustomSideBarMenu';
import MyDonationScreen from './screens/MyDonationScreen'
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedThingsScreen from '../screens/MyReceivedThingsScreen';
import {Icon} from 'react-native-elements'

export const AppDrawerNavigator = createDrawerNavigator({
    tab:{
        screen:AppTabNavigator,
        navigationOptions:{
            drawerIcon:<Icon name="heartbeat" type="font-awesome"/>
        }
    },
    Settings:{
        screen:SettingsScreen,
        navigationOptions:{
            drawerIcon:<Icon name="settings" type="font-awesome"/>,
            drawerLabel:"Settings"
        }
    },
    MyDonations:{
        screen:MyDonationScreen,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type="font-awesome"/>,
            drawerLabel:"My donations"
        }
    },
    Notification : {
        screen : NotificationScreen,
        navigationOptions:{
          drawerIcon:<Icon name="bell" type="font-awesome"/>,
          drawerLabel:"Notifications"
        }
      },
    MyReceivedThings:{
        screen: MyReceivedThingsScreen,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type="font-awesome"/>,
            drawerLabel:"My recieved things"
        }
    },
    
},

    {
        contentComponent:CustomSideBarMenu
    },
    {
        initialRouteName:'tab'
})