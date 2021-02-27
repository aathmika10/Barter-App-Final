import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyRecievedThingsScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            RecievedThings:[]
        }
        this.requestRef=null
    }
    getRecievedThingsList=()=>{
        this.requestRef=db.collection("requested_things")
        .where('user_id','==',this.state.userId)
        .where('thing_status','==','recieved')
        .onSnapshot((snapshot)=>{
            var RecievedThingsList=snapshot.docs.map((doc)=>doc.data())
            this.setState({
                RecievedThingsList:RecievedThingsList
            })
        })
    }
    componentDidMount(){
        this.getRecieveedThingsList()
    }
    componentWillUnmount(){
        this.requestRef();
    }
    keyExtractor=(item,index)=>index.toString()

    renderItem=({item,i})=>{
        console.log(item.thing_name);
        return(
            <ListItem
            key={i}
            title={item.thing_name}
            subtitle={item.thingStatus}
            titleStyle={{color:'black',fontWeight:'bold'}}
            bottomDivider/>
        )
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="RecievedThings" navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.recievedThingsList.length===0
                        ?(
                            <View style={styles.subcontainer}>
                                <Text style={{fontSize:20}}>List of all recieved things</Text>
                                </View>
                        )
                        :(
                            <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.recievedThingsList}
                            renderItem={this.renderItem}/>
                        )
                    }
                    </View>
                </View>
        )
    }
}
const styles=StyleSheet.create({
    subContainer:{
        flex:1,
        fonstSize:20,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ff5722',
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:8
        }
    }
})