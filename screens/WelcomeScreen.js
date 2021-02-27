import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView,ScrollView } from 'react-native';
import db from '../config.js'
import firebase from 'firebase'

export default class WelcomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailId: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            contact: "",
            confirmPassword: "",
            isModalVisible: 'false'
        }
    }
     userSignUp = (emailId, password,confirmPassword) =>{
        if(password !== confirmPassword){
            return Alert.alert("password doesn't match\nCheck your password.")
        }else{
          firebase.auth().createUserWithEmailAndPassword(emailId, password)
          .then(()=>{
            db.collection('users').add({
              first_name:this.state.firstName,
              last_name:this.state.lastName,
              contact:this.state.contact,
              email_id:this.state.emailId,
              address:this.state.address,
              IsThingRequestActive:false
            })
            return  Alert.alert(
                 'User Added Successfully',
                 '',
                 [
                   {text: 'OK', 
                   onPress: () => this.setState({isModalVisible : false})},
                 ]
             );
          })
          .catch((error)=> {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage)
          });
        }
      }
     
     userLogin = (emailId, password)=>{
        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then(()=>{
          this.props.navigation.navigate('Home')
        })
        .catch((error)=> {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage)
        })
      }
     
    showModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isModalVisible}>
                <View style={styles.modalContainer}>
                    <ScrollView style={{ width: "100%" }}>
                        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
                            <Text style={styles.modalTitle}>REGISTRATION FORM</Text>
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"first name"}
                                maxLength={15}
                                onChangeText={(text) => {
                                    this.setState({
                                        firstName: text
                                    })
                                }} />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"last name"}
                                maxLength={25}
                                onChangeText={(text) => {
                                    this.setState({
                                        lastName: text
                                    })
                                }} />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"Contact"}
                                maxLength={10}
                                keyboardType={"numeric"}
                                onChangeText={(text) => {
                                    this.setState({
                                        contact: text
                                    })
                                }} />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"Address"}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        address: text
                                    })
                                }} />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"Email"}
                                keyboardType={"email-address"}
                                onChangeText={(text) => {
                                    this.setState({
                                        emailId: text
                                    })
                                }} />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"Password"}
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        password: text
                                    })
                                }} />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={"Confirm password"}
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        confirmPassword: text
                                    })
                                }} />
                                <View style={styles.modalBackButton}>
                                    <TouchableOpacity style={styles.registerButton}
                                    onPress={()=>{
                                        this.userSignUp(
                                            this.state.emailId,
                                            this.state.password,
                                            this.state.confirmPassword)
                                    }}>
                                        <Text style={styles.registerButtonText}>REGISTER</Text>
                                    </TouchableOpacity>
                                </View>
                            <View style={styles.modalBackButton}>
                                <TouchableOpacity style={styles.cancelButton}
                                    onPress={() => {
                                        this.setState({
                                            isModalVisible: false
                                        })
                                    }}>
                                    <Text style={styles.registerButtonText}>CANCEL</Text>
                                </TouchableOpacity>

                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>

            </Modal>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    {this.showModal()}
                    <Text style={styles.title}>BARTER APP</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TextInput
                        style={styles.loginBox}
                        placeholder="barter@gmail.com"
                        placeholderTextColor="#7e3ba5"
                        keyboardType="email-address"
                        onChangeText={(text) => {
                            this.setState({
                                emailId: text
                            })
                        }} />
                    <TextInput
                        style={styles.loginBox}
                        secureTextEntry={true}
                        placeholder="password"
                        placeholderTextColor="#7e3ba5"
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })
                        }} />

                    <TouchableOpacity
                        style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
                        onPress={() => { this.userLogin(this.state.emailId, this.state.password) }} >
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
                        onPress={() => this.setState({
                            isModalVisible: true
                        })}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7b8f2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 60,
        fontWeight: '200',
        paddingBottom: 30,
        color: '#000000',
    }, 
     loginBox: {
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: '#ea5d8f',
        fontSize: 20,
        margin: 10,
        paddingLeft: 10
    },
    KeyboardAvoidingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

   modalTitle:{
       justifyContent:'center',
       alignSelf:'center',
       fontSize:30,
       color:'#d640c4',
       margin:50
   },
   modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
},

   formTextInput:{
       width:'75%',
       heigth:35,
       alignSelf:'center',
       borderColor:"black",
       borderRadius:10,
       borderWidth:1,
       marginTop:10,
       padding:10
   },
   registerButton:{
       width:200,
       height:40,
       alignItems:'center',
       justifyContent:'center',
       borderWidth:1,
       borderRadius:10,
       marginTop:30,
   },
   registerButtonText:{
    color:'#ea5d8f',
    fontSize:15,
    fontWeight:"bold"
   },
   cancelButton:{
       width:200,
       height:30,
       justifyContent:'center',
       alignItems:'center',
       marginTop:5,
       color:'#ea5d8f'
   },
    button: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 25,
        backgroundColor: "#ea5d8f",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 9.2,
        elevation: 60,
        padding:10
    },
    buttonText: {
        color: '#ffff',
        fontWeight: '200',
        fontSize: 20
    },
  
  
})
