import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
    static navigationOptions = { header: null };

    constructor() {
        super()
        this.state = {
            userId: firebase.auth().currentUser.email,
            username: "",
            allDonations: []
        }
        this.requestRef = null
    }
    getDonorDetails = (donorId) => {
        db.collection("users").where("email_id", "==", donorId).get()
            .then((snapshot => {
                snapshot.forEach((doc) => {
                    this.setState({
                        "donorName": doc.data().first + name + " " + doc.data.last_name
                    })
                })
            }))
    }

    getAllDonations = () => {
        this.requestRef = db.collection("all_donations").where('donor_id', '==', this.state.userId)
            .onSnapshot((snapshot) => {
                var allDonations = []
                snapshot.docs.map((doc) => {
                    var donation = doc.data()
                    donation["doc_id"] = doc.id
                    allDonations.push(donation)
                    this.setState({
                        allDonations: allDonations,
                    });

                })
            })
    }

    sendThing = (itemDetails) => {
        if (itemDetails.request_status === "Item sent") {
            var requestStatus = "Donor interested"
            db.collection("all_donations").doc(itemDetails.doc_id).update({
                "request_status": "Donor interested"
            })
            this.sendNotification(itemDetails, requestStatus)
        }
        else {
            var requestStatus = "item sent"
            db.collection("all_donations").doc(itemDetails.doc_id).update({
                "request_status": "Item sent"
            })
            this.sendNotification(itemDetails, requestStatus)
        }
    }

    sendNotification = (itemDetails, requestStatus) => {
        var requestId =thingDetails.request_id
        var donorId =thingDetails.donor_id
        db.collection("all_notifications")
            .where("request_id", "==", requestId)
            .where("donor_id", "==", donorId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var message = ""
                    if (requestStatus === "Item sent") {
                        message = this.state.donorName + "sent you a thing"
                    }
                    else {
                        message = this.state.donorName + "has shown interest in donating this item"
                    }
                    db.collection("all_notifications").doc(doc.id).update({
                        "message": message,
                        "notification_status": "unread",
                        "date": firebase.firestore.FieldValue.serverTimestamp()
                    })
                })
            })
    }
    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        <ListItem
            key={i}
            title={item.thing_name}
            subTitle={"Requested by:" + item.requested_by + "\nStatus:" + item.request_status}
            leftElement={<Icon name="thing" type="font-awesome" color='#424242' />}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={
                <TouchableOpacity style={[styles.button, { backgroundColor: item.request_status === "Item Sent" ? "green" : "red" }]}>
                    onPress={() => {
                        this.sendThing(item)
                    }}
                    <Text style={{ color: " #ffffff" }}>{item.request_status === "Item sent" ? "Item sent" : "send item"}Send thing</Text>
                </TouchableOpacity>
            }
            bottomDivider
        />
    }
    componentDidMount() {
        this.getDonorDetails(this.state.donorId)
        this.getAllDonations()
    }
    componentWillUnmount() {
        this.requestRef()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader navigation={this.props.navigation} title="My Donations" />
                <View style={{ flex: 1 }}>
                    {
                        this.state.allDonations.length === 0
                            ? (
                                <View style={styles.subTitle}>
                                    <Text style={{ fontSize: 20 }}>List of all things exchanges</Text>
                                </View>
                            )
                            : (
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.allDonations}
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
    button: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff5722',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 16
    },
    subTitle: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})