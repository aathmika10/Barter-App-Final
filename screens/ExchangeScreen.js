import React,{Component} from 'react';
import { View,Text, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import db from '../config';
import firebase from "firebase";
import MyHeader from'../components/MyHeader';

export default class ExchangeScreen extends Component{
    constructor(){
        super();
        this.state ={
          userId : firebase.auth().currentUser.email,
          thingName:"",
          reasonToRequest:"",
          IsThingRequestActive : "",
          requestedThingName: "",
          thingStatus:"",
          requestId:"",
          userDocId: '',
          docId :''
        }
      }
createUniqueId(){
    return Math.random().toString(36).substring(7)
}
addRequest=(thingName,reasonToRequest)=>{
    var userId=this.state.userId
    var randomRequestId=this.createUniqueId()

    db.collection("requested_things").add({
        "user_id":userId,
        "thing_name":thingName,
        "reason_to_request":reasonToRequest,
        "request_id":randomRequestId,
        "thing_status" : "requested",
        "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })
    await this.getThingRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsThingRequestActive: true
      })
    })
  })
    this.setState({
        thingName:"",
        reasonToRequest:"",
        requestId: randomRequestId
    })
    return Alert.alert("thing requested successfully")
}

receivedThings=(thingName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_things').add({
        "user_id": userId,
        "thing_name":thingName,
        "request_id"  : requestId,
        "thingStatus"  : "received",
  
    })
  }
  
  getIsThingRequestActive(){
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsThingRequestActive:doc.data().IsThingRequestActive,
          userDocId : doc.id
        })
      })
    })
  }
  getThingRequest =()=>{
 
  var thingRequest=  db.collection('requested_things')
    .where('user_id','==',this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().thing_status !== "received"){
          this.setState({
            requestId : doc.data().request_id,
            requestedThingName: doc.data().thing_name,
            thingStatus:doc.data().thing_status,
            docId     : doc.id
          })
        }
      })
  })}  
  sendNotification=()=>{
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
  
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var thingName =  doc.data().thing_name
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the thing " + thingName ,
              "notification_status" : "unread",
              "thing_name" : thingName
            })
          })
        })
      })
    })
  }
  
componentDidMount(){
    this.getThingRequest()
    this.getIsThingRequestActive()
  
  }
  
  updateThingRequestStatus=()=>{
  
    db.collection('requested_thing').doc(this.state.docId)
    .update({
      thing_status : 'recieved'
    })
  
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
   
        db.collection('users').doc(doc.id).update({
          IsThingRequestActive: false
        })
      })
    })
  }

  render(){

    if(this.state.IsThingRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Thing Name</Text>
          <Text>{this.state.requestedThingName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Thing Status </Text>

          <Text>{this.state.thingStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateThingRequestStatus();
            this.receivedThings(this.state.requestedThingName)
          }}>
          <Text>I recieved the Thing </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Thing" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter Thing name"}
                onChangeText={(text)=>{
                    this.setState({
                       thingName:text
                    })
                }}
                value={this.state.thingName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the thing"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.thingName,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
    keyBoardStyle : {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      },
      formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#00000',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
      },
      button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#9314ba",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop:20
        },
      }
    )