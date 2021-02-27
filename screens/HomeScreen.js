import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class HomeScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId:firebase.auth().currentUser.email,
      requestedThingsList : []
    }
  this.requestRef= null
  }

  getrequestedThingsList =()=>{
    this.requestRef = db.collection("requested_things")
    .onSnapshot((snapshot)=>{
      var requestedThingsList = snapshot.docs.map(document => document.data());
      this.setState({
        requestedThingsList : requestedThingsList

      });
    })
  }

  componentDidMount(){
    this.getrequestedThingsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.thing_name}
        subtitle={item.reason_to_request}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
            onPress={()=>{
              this.props.navigation.navigate("RecieverDetails",{"details":item})
            }}>
              <Text style={{color:'#ffff'}}>EXCHANGE</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Home" navigation={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.requestedThingsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Requested Things</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedThingsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#9314ba",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})