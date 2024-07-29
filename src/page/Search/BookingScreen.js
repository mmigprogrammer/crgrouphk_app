import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Dimensions,
  Platform,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import RNPickerSelect from 'react-native-picker-select';
import CustSliderEntry from '../../component/CustSliderEntry';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import EntyIcon from 'react-native-vector-icons/Entypo';
import CalendarPicker from 'react-native-calendar-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import cgaxios from '../../component/ColorGroupAxiosNet';

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').width / 1.5;
const ITEM_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = Dimensions.get('window').width / 1.5;
import * as i18n from '../../i18n/i18n';
import {setSearchListTitle} from '../../redux/actions';
import {each} from 'lodash';

const BookingScreen = ({route, navigation}) => {
  i18n.setI18nConfig();

  const dispatch = useDispatch();
  const {userId} = useSelector(state => state.loginReducer);
  const {userMemberId} = useSelector(state => state.loginReducer);

  const [isAdd, setIsAdd] = useState(false);

  const [minTime, setMinTime] = useState(
    moment(new Date().setHours(8, 0, 0, 0)).toDate(),
  );
  const [maxTime, setMaxTime] = useState(
    moment(new Date().setHours(17, 0, 0, 0)).toDate(),
  );

  const [date, setDate] = useState(moment(new Date()).add(2, 'days').toDate());
  const [time, setTime] = useState(moment(new Date().setHours(9, 0)).toDate());

  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const [slider1Ref, setSlider1Ref] = useState();
  const [isLoading, seIsLoading] = useState(true);

  const [avBooking, setAvBooking] = useState();
  const [userBooking, setUserBooking] = useState();
  const [branchList, setBranchList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [currentBooking, setCurrentBooking] = useState([]);
  const [avBookingTimeSlot, setAvBookingTimeSlot] = useState([]);
  const [currentStylist, setCurrentStylist] = useState();
  const [open3, setOpen3] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchSelect, setBranchSelect] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [selectedBookingTimeSlot, setSelectedBookingTimeSlot] = useState(null);
  const [bookingGoodId, setBookingGoodId] = useState([]);
  const [amountTotal, setAmountTotal] = useState();
  const [bookId, setBookId] = useState(undefined);
  const [userPhone, setUserPhone] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  //const [userMemberId, setUserMemberId] = useState(undefined);
  const [branchTel, setBranchTel] = useState(undefined);
  const [currentStylistName, setCurrentStylistName] = useState(undefined);
  const [appointDetail, setAppointDetail] = useState();
  const [cgbookId, setCgBookId] = useState();

  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);

  const {searchListTitle} = useSelector(state => state.shoppingReducer);
  var previousTitle = null;

  console.log(userMemberId);

  async function fetchMyAPI() {
    const bookItem = route.params.goodsId;
    const bookQty = route.params.goodsQty;
    const bookAmount = route.params.goodsAmount;
    console.log(bookItem);
    console.log(bookAmount);
    setAmountTotal(bookAmount);

    var booking = [];
    for (let i = 0; i < bookItem.length; i++) {
      var temp = {id: bookItem[i], qty: bookQty[i]};
      booking.push(temp);
    }
    console.log(booking);

    const bookingItem = axios
      .get('Goods/getAllGoods')
      .then(data => {
        console.log(data.data.data);
        var temp = [];
        booking.map(item => {
          for (let i = 0; i < data.data.data.length; i++) {
            if (item.id == data.data.data[i].id) {
              console.log(item.id);
              temp.push({
                bookingGood: data.data.data[i],
                bookingQty: item.qty,
              });
            }
          }
        });
        console.log(temp);
        setBookingList(temp);
        console.log(bookingList);

        // declare temp1 here
        let temp1 = [];
        temp.map(list => {
          // push values into temp1
          temp1.push(list.bookingGood.name + '*' + list.bookingQty);
        });
        temp1 = temp1.join(',');
        console.log(temp1);
        setAppointDetail(temp1);
      })
      .catch(e => {
        console.log('11111');
      });
    console.log(bookingList);

    if (userId) {
      const resuserBooking = await axios.get('booking/getUserBooking', {
        params: {
          uid: userId,
        },
      });
      setUserBooking(resuserBooking.data.data);
    }

    const getUserPhone = axios
      .get('user/getUserInfoPhone', {
        params: {
          uid: userId,
        },
      })
      .then(data => {
        console.log(data.data.data);
        setUserPhone(data.data.data.tel);
        setUserName(data.data.data.name);
        //setUserMemberId(data.data.data.memberId);
      });
  }

  //console.log(amountTotal);

  useEffect(() => {
    seIsLoading(true);
    try {
      fetchMyAPI().then(() => seIsLoading(false));
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
    };
  }, [isFocused]);

  const rtDate = date => {
    if (date)
      return (
        date.getFullYear() +
        '  年  ' +
        (date.getMonth() + 1) +
        '  月  ' +
        date.getDate() +
        '  日'
      );
  };

  const getBookingGoodId = () => {
    var temp = [];
    bookingList.map(item => {
      temp.push(item.bookingGood.id);
    });
    console.log(temp);
    setBookingGoodId(temp);
    return temp;
  };

  const bookSchedule = async () => {
    var dateval = moment(date).format('DD/MM/YYYY');
    var chosenDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    console.log(selectedBookingTimeSlot);
    // var timeval = moment(selectedBookingTimeSlot).format('hh:mm');
    // console.log(timeval);
    var dateTime = moment(
      dateval + ' ' + selectedBookingTimeSlot,
      'DD/MM/YYYY HH:mm',
    );

    const appoinTime = moment(dateTime).format('YYYYMMDDHHmm');
    //console.log(ormattedString);
    //console.log(dateval + ' ' + selectedBookingTimeSlot);
    //console.log(reserveTime());
    //console.log(new Date(dateTime));
    var booking_end_time = moment(
      new Date(new Date(dateTime).getTime() + reserveTime() * 60 * 60 * 1000),
      'DD/MM/YYYY HH:mm',
    );
    //console.log(booking_end_time);
    // console.log({
    //   do: 'add',
    //   uid: userId,
    //   booking_time: dateTime.format('YYYY-MM-DD HH:mm:ss'),
    // });
    console.log("bookinglist : ",bookingList);
    let goodIds = [];  bookingList.map(item => {
      goodIds.push(item.bookingGood.id);
    });
    console.log(goodIds.join(','));
    await cgaxios
      .post('Common/Appointment', {
        AccessCode: 'ColorGroup',
        AppointmentId: 0,
        BranchId: selectedBranch,
        Phone: userPhone,
        CustomerName: userName,
        AppointTime: appoinTime,
        AppintDetail: appointDetail,
        StaffId: currentStylist,
        MemberId: userMemberId ? userMemberId : 0,
      })
      .then(data1 => {
        console.log("colort group called");
        setCgBookId(data1.data.data.AppointmentId);
        axios
          .get('booking/bookingSchedule', {
            params: {
              do: 'add',
              uid: userId,
              bookId: data1.data.data.AppointmentId,
              userName: userName,
              userPhone: userPhone,
              branchId: selectedBranch,
              branchTel: branchTel,
              booking_start_time: dateTime.format('YYYY-MM-DD HH:mm:ss'),
              booking_end_time: booking_end_time.format('YYYY-MM-DD HH:mm:ss'),
              stylist_id: currentStylist,
              stylist_name: currentStylistName,
              goodId: goodIds.join(','),
              appintDetail: appointDetail,
              amount: amountTotal,
              MemberId: userMemberId ? userMemberId : 0,
            },
          }).then(data => {
            //alert('success2');
            //console.log(data);
            setBookId(data.data.data);
            //if submit booking,fetchapi again
            //navigation.push('Order');
            return function cleanup() {
              fetchMyAPI();
            };
          });
      })
  };

  //setBookId() is not updating the state immediately. This is because setState is asynchronous, and it may take some time to update the state.
  //To ensure that bookId is set before navigating to the next screen, you can use the useEffect hook to listen for changes in bookId. Once bookId has a value, you can navigate to the next screen.

  useEffect(() => {
    if (bookId !== undefined) {
      try {
        navigation.pop();
      } catch (error) {
        console.log(error);
      }

      navigation.navigate('UserScreen', {
        screen: 'OrderDetail',
        params: {
          bookingId: bookId,
          cgbookId: cgbookId,
        },
      });
    }
  }, [bookId]);

  //remember to put the const outside the function

  const fetchBranchList = async () => {
    const getBranchList = cgaxios
      .post('Common/BranchInfo', {
        AccessCode: 'ColorGroup',
        LastUpdateTime: '19000101000000000',
      })
      .then(data => {
        console.log(data.data.data);
        setBranchList(data.data.data);
        var temp = [];
        data.data.data.map(branch => {
          if (
            branch.BranchId !== 52 &&
            branch.BranchStatus == 1 &&
            branch.BranchId !== 54
          ) {
            temp.push({
              label: branch.BranchAddress, // label for the dropdown item
              value: branch.BranchId, // value of the dropdown item
            });
          }
        });
        //console.log(temp);
        //remember to put setstate with temp, because temp in defined in block"then",
        //This means that temp is not defined outside of the then block,
        //so you cannot access it when you call setBranchSelect(temp) outside of that block.
        setBranchSelect(temp); // set the items for the dropdown list
        console.log(branchSelect);
      });
  };

  useEffect(() => {
    fetchBranchList();
  }, []);

  //use to updated status of 指定的variable，in this case, is [value1]
  //in the below code, once the value of [value1]changed, will console.log its value.
  useEffect(() => {
    console.log(selectedBranch);
    stylistList();
    //eachtime reselect the branch, clean up the state of currentstylist
    setCurrentStylist();
    getBranchPhone();
  }, [selectedBranch]);

  useEffect(() => {
    //console.log(selectedBranch);
    //console.log(date);
    avTimeSlot();
    setAvBookingTimeSlot([]);
  }, [date]);

  useEffect(() => {
    avTimeSlot();
    setAvBookingTimeSlot([]);
    setSelectedBookingTimeSlot([]);
    console.log(selectedBookingTimeSlot);
  }, [currentStylist]);

  //console.log(branchList);

  const getBranchPhone = () => {
    branchList.map(branch => {
      if (branch.BranchId == selectedBranch) {
        console.log(branch.BranchPhone);
        setBranchTel(branch.BranchPhone);
      }
    });
  };

  //remember to put the function out of the above function!
  const picker = () => {
    return (
      <DropDownPicker
        style={{
          width: '95%',
          height: 32,
          borderWidth: 0,
        }}
        dropDownContainerStyle={{
          backgroundColor: 'white',
          width: '95%',
        }}
        onChangeValue={() => {
          stylistList();
        }}
        placeholder={i18n.t('select_branch')}
        open={open1}
        value={selectedBranch}
        items={branchSelect}
        setOpen={setOpen1}
        setValue={setSelectedBranch}
        setItems={setBranchSelect}
      />
    );
  };

  const timepicker = () => {
    return (
      <DropDownPicker
        style={{
          width: '90%',
          height: 32,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
          //borderColor: 'rbga(0,0,0,0)',
          color: 'gray',
          fontSize: 15,
        }}
        listMode='MODAL'
        dropDownDirection="TOP"
        dropDownContainerStyle={{
          //backgroundColor: 'rgba(0,0,0,0)',
          width: '90%',
          color: 'gray',
        }}
        labelStyle={{
          color: 'gray',
          fontSize: 15,
        }}
        arrowIconStyle={{
          color: 'gray',
        }}
        tickIconStyle={{
          color: 'gray',
        }}
        onChangeValue={() => {
          // item => setSelectedBookingTimeSlot(item.value);
        }}
        placeholder={i18n.t('select_time')}
        open={open3}
        value={selectedBookingTimeSlot}
        items={avBookingTimeSlot}
        setOpen={setOpen3}
        setValue={setSelectedBookingTimeSlot}
        setItems={setAvBookingTimeSlot}
      />
    );
  };

  const stylistList = async () => {
    //console.log(selectedBranch);
    const stylists = await axios
      .get('booking/getStylists', {
        params: {
          branchId: selectedBranch,
        },
      })
      .then(data => {
        var temp = [];
        console.log(data.data.data);
        console.log(selectedBranch);
        setStylists(data.data.data);
      })
      .catch(error => {
        console.log('11111');
      });
  };
  //console.log(stylists);

  const bookList = () => {
    return (
      <View>
        <FlatList
          en
          data={bookingList}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: 10,
                }}>
                <View style={{}}>
                  <Image
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 10,
                    }}
                    source={
                      item.bookingGood.coverImg ? (
                        {uri: item.bookingGood.coverImg[0]}
                      ) : (
                        <></>
                      )
                    }></Image>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      marginLeft: 14,
                      width: '83%',
                    }}>
                    <Text
                      style={{
                        marginVertical: 13,
                      }}>
                      {item.bookingGood.name}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>$ {item.bookingGood.price} UP</Text>
                      <Text>x {item.bookingQty}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  //calculate total reserve time
  const reserveTime = () => {
    var hours = 0;
    if (bookingList && bookingList.length > 0) {
      for (let i = 0; i < bookingList.length; i++) {
        hours +=
          parseFloat(bookingList[i].bookingGood.hour) *
          bookingList[i].bookingQty;
      }
    }
    return hours;
  };

  //console.log(timeslots);//string

  const avTimeSlot = () => {
    let temp = [];
    axios
      .get('booking/getAllBooking', {
        params: {
          sid: currentStylist,
        },
      })
      .then(data => {
        console.log(data.data.data);
        if (data.data.data) {
          setCurrentBooking(data.data.data);
          const openTime = '10:00';
          const closeTime = '20:00';
          const interval = 30; // in minutes

          const chosenDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          //break down the opening hr into small timeslots with 30mins intervels
          const timeslots = [];
          let currentTime = new Date(`${chosenDate} ${openTime}`);

          while (currentTime < new Date(`${chosenDate} ${closeTime}`)) {
            const timeString = `${currentTime
              .getHours()
              .toString()
              .padStart(2, '0')}:${currentTime
              .getMinutes()
              .toString()
              .padStart(2, '0')}`;
            timeslots.push(timeString);
            currentTime = new Date(currentTime.getTime() + interval * 60000);
          }
          var reserveHour = reserveTime() * 60 * 60 * 1000;
          temp = timeslots;

          // compare every avtimeslot to existing booking and push the av one in temp
          timeslots.map(timeslot => {
            const startTime = new Date(`${chosenDate} ${timeslot}`);
            const endTime = new Date(startTime.getTime() + reserveHour);
            const close = new Date(
              new Date(
                `${chosenDate} ${timeslots[timeslots.length - 1]}`,
              ).getTime() +
                30 * 60 * 1000,
            );
            for (let i = 0; i < data.data.data.length; i++) {
              //transform the existing bookingdate to make it in the format with chosen booking date
              var bookDatesString = data.data.data[i].booking_start_time.slice(
                0,
                10,
              );
              var bookingDate = new Date(bookDatesString).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              );
              //if there are existingbooking in the chosen day, check if any avaliable timeslots
              if (chosenDate == bookingDate) {
                if (
                  //for new booking, its starttime should be earlier than the endtime of exsiting booking and endtime should be earlier than the startingtime of exsiting booking
                  //or starttime later of new booking should be later than endtime of existing booking and earlier than the close time of salon
                  (startTime.getTime() >=
                    new Date(data.data.data[i].booking_start_time).getTime() &&
                    startTime.getTime() <
                      new Date(data.data.data[i].booking_end_time).getTime()) ||
                  (startTime.getTime() <=
                    new Date(data.data.data[i].booking_start_time).getTime() &&
                    endTime.getTime() >
                      new Date(data.data.data[i].booking_start_time)) ||
                  endTime.getTime() > close.getTime()
                ) {
                  temp = temp.filter(function (item) {
                    return item !== timeslot;
                  });
                }
              } else {
                if (endTime.getTime() > close.getTime()) {
                  temp = temp.filter(function (item) {
                    return item !== timeslot;
                  });
                }
              }
            }
          });
          console.log(temp);
          var temp1 = [];
          temp.map(timeslot => {
            temp1.push({
              label: timeslot,
              value: timeslot,
            });
          });
          console.log(temp1);
          setAvBookingTimeSlot(temp1);
        } else {
          console.log('123');
          const openTime = '10:00';
          const closeTime = '20:00';
          const interval = 30; // in minutes

          const chosenDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          //break down the opening hr into small timeslots with 30mins intervels
          const timeslots = [];
          let currentTime = new Date(`${chosenDate} ${openTime}`);

          while (currentTime < new Date(`${chosenDate} ${closeTime}`)) {
            const timeString = `${currentTime
              .getHours()
              .toString()
              .padStart(2, '0')}:${currentTime
              .getMinutes()
              .toString()
              .padStart(2, '0')}`;
            timeslots.push(timeString);
            currentTime = new Date(currentTime.getTime() + interval * 60000);
          }
          var reserveHour = reserveTime() * 60 * 60 * 1000;
          var temp = timeslots;
          timeslots.map(timeslot => {
            const startTime = new Date(`${chosenDate} ${timeslot}`);
            const endTime = new Date(startTime.getTime() + reserveHour);
            const close = new Date(
              new Date(
                `${chosenDate} ${timeslots[timeslots.length - 1]}`,
              ).getTime() +
                30 * 60 * 1000,
            );

            if (endTime.getTime() > close.getTime()) {
              temp = temp.filter(function (item) {
                return item !== timeslot;
              });
            }
          });

          console.log(temp);
          var temp1 = [];
          temp.map(timeslot => {
            temp1.push({
              label: timeslot,
              value: timeslot,
            });
          });
          setAvBookingTimeSlot(temp1);
        }
      })
      .catch(e => {
        console.log('cannot get');
      });
    //calculate the total reserve time
    //time slot for everyday
  };

  // const getStylistBookingTime = async sid => {
  //   const currentStylistBooking = await axios
  //     .get('booking/getAllBooking', {
  //       params: {
  //         sid,
  //       },
  //     })
  //     .then(data => {
  //       console.log(data.data.data);
  //       var temp = data.data.data;
  //       setCurrentBooking(temp);
  //     });
  // };

  return (
    <>
      <ScrollView>

      {isLoading ? (
        <View>
          <ActivityIndicator
            color="#009b88"
            size="large"
            style={{marginTop: '40%'}}
          />
        </View>
      ) : (
        <SafeAreaView style={{backgroundColor: '#F6F6F6'}}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  margin: 20,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 35,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <Text style={{}}>{i18n.t('booking_time')}</Text>
                <Text style={{textAlign: 'center'}}>
                  {userBooking ? userBooking.booking_time : ''}{' '}
                </Text>
                <Text style={{textAlign: 'center'}}>{i18n.t('on_time')}</Text>

                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    padding: 10,
                    elevation: 2,
                  }}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text
                    style={{
                      backgroundColor: '#7ad6b9',
                      textAlign: 'center',
                      borderRadius: 10,
                      width: 90,
                      overflow: 'hidden',
                    }}>
                    {i18n.t('close')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View
            style={{
              paddingLeft: '5%',
              paddingTop: '5%',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
            }}>
            <View
              style={{
                width: '100%',
                height: 20,
                marginBottom: 10,
              }}>
              <Text>{i18n.t('choose_branch')}:</Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 32,
                marginBottom: 16,
                zIndex: 100,
              }}>
              {picker()}
            </View>
            <View
              style={{
                width: '100%',
                height: 'auto',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '95%',
                }}>
                <Text>{i18n.t('choose_service')}:</Text>
                <Text
                  style={{
                    color: '#E3A23B',
                    textDecorationLine: 'underline',
                    fontSize: 12,
                  }}
                  onPress={() => {
                    navigation.navigate('Search');
                  }}>
                  {i18n.t('click_for_more')}
                </Text>
              </View>

              <View
                style={{
                  height: 135,
                }}>
                {bookList()}
              </View>
              <Text
                style={{
                  marginTop: 16,
                }}>
                {i18n.t('choose_stylist')}:
              </Text>
              <View>
                <FlatList
                  data={stylists}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => {
                    //remember to create view inside the return
                    return (
                      <View
                        style={{
                          paddingTop: 10,
                          display: 'flex',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            item.remark && item.remark.length > 1
                              ? alert(item.remark)
                              : '';
                            // getStylistBookingTime(item.sid);
                            setCurrentStylist(item.staffId);
                            setCurrentStylistName(item.staffNameEn);
                          }}>
                          <View
                            style={{
                              marginRight: 16,
                            }}>
                            <Image
                              style={{
                                width: 65,
                                height: 65,
                                display:
                                  currentStylist == item.staffId
                                    ? 'flex'
                                    : 'none',
                                borderRadius: 100,
                                borderColor: '#E3A23B',
                                position: 'absolute',
                                zIndex: 100,
                              }}
                              source={require('../../img/selected.png')}></Image>

                            <Image
                              style={{
                                width: 65,
                                height: 65,
                                borderWidth:
                                  currentStylist == item.staffId ? 2 : 0,
                                borderRadius: 100,
                                borderColor: '#E3A23B',
                              }}
                              source={
                                item.image
                                  ? {uri: item.image}
                                  : require('../../img/stylistIcon.png')
                              }></Image>
                            <View>
                              <Text style={{textAlign: 'center'}}>
                                {item.staffNameEn}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            <View style={{}}>
              {selectedBranch ? (
                <>
                  {/* <View style={{ marginTop: '5%' }}>{mainExample()}</View> */}
                  <View
                    style={{
                      marginTop: 16,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontWeight: '400',
                          fontSize: 15,
                        }}>
                        {i18n.t('booking_consult')}:
                      </Text>
                    </View>

                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}>
                        <EntyIcon
                          name="calendar"
                          style={{fontSize: 15, color: '#6A6A6A'}}></EntyIcon>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: Platform.OS === 'ios' ? '500' : '700',
                            color: '#79757F',
                            letterSpacing: 3,
                          }}>
                          {i18n.t('date')}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={{
                          borderColor: 'gray',
                        }}
                        onPress={() => {
                          setOpen(true);
                        }}>
                        <Text
                          style={{
                            height: 20,
                            fontSize: 15,
                            marginLeft: '5%',
                            color: 'gray',
                          }}>
                          {rtDate(date) || '-'}
                        </Text>
                        <DatePicker
                          theme="auto"
                          modal
                          mode="date"
                          open={open}
                          minimumDate={moment(new Date())
                            
                            .toDate()}
                          maximumDate={moment(new Date())
                            .add(30, 'days')
                            .toDate()}
                          minuteInterval={30}
                          date={date}
                          onConfirm={date => {
                            setOpen(false);
                            setDate(date);
                          }}
                          onCancel={() => {
                            setOpen(false);
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Icon
                          name="time-outline"
                          style={{fontSize: 15, color: '#6A6A6A'}}></Icon>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: Platform.OS === 'ios' ? '500' : '700',
                            marginBottom: '2%',
                            color: '#79757F',
                            letterSpacing: 3,
                          }}>
                          {i18n.t('time')}
                        </Text>
                      </View>

                      <View
                        style={{
                          width: '45%',
                          fontSize: 15,
                        }}>
                        {timepicker()}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                        }}>
                        {i18n.t('reserve_time')}:
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          marginTop: 6,
                        }}>
                        <MaterialIcons
                          name="timer"
                          style={{
                            fontSize: 41,
                            color: '#E3A23B',
                            fontWeight: 'regular',
                          }}></MaterialIcons>
                      </View>
                      <View
                        style={{
                          marginTop: 12,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#E3A23B',
                          }}>
                          {reserveTime()}
                          &nbsp;
                          {reserveTime() > 1 ? i18n.t('hours') : i18n.t('hour')}
                        </Text>
                      </View>
                    </View>
                  </View>
                          
                  {userId ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          selectedBookingTimeSlot.length != 0
                            ? '#E3A23B'
                            : '#D9D9D9',
                        marginHorizontal: '6%',
                        height: SLIDER_WIDTH * 0.11,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        width: '85%',
                        borderRadius: 20,
                        height: '12%',
                      }}
                      disabled={
                        selectedBookingTimeSlot.length != 0 ? false : true
                      }
                      onPress={async () => {
                        //The reason why bookId cannot be passed to the next screen after onPress is because bookSchedule() is an asynchronous function that returns a promise. Therefore, when you call console.log(bookId) immediately after bookSchedule(), the bookId value has not yet been set because the promise is still being resolved.To pass the bookId to the next screen, you should wait for the promise to be resolved and then navigate to the next screen. You can do this by using the await keyword before calling bookSchedule() and then using await again before navigating to the next screen:
                        bookSchedule();
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        {i18n.t('booking_now')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#5DA1D9',
                        marginHorizontal: '6%',
                        height: SLIDER_WIDTH * 0.11,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        width: '85%',
                      }}
                      onPress={() => {
                        navigation.navigate('UserScreen', {screen: 'Login'});
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        {i18n.t('login_first')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <Text></Text>
                </>
              )}
          
            </View>
          </View>
          <View style={{height:100}}></View>
        </SafeAreaView>
      )}
      </ScrollView>

    </>
  );
};

const styles = StyleSheet.create({
  underline: {
    marginVertical: '2.5%',
    height: 1,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  textStyle: {fontSize: 12, fontWeight: Platform.OS === 'ios' ? '200' : '600'},
});

export default BookingScreen;

  {/* <TouchableOpacity style={!isProductInfoOpen ? { marginHorizontal: '5%' } : { height: '60%', marginHorizontal: '5%' }}
            onPress={() => {
              setIsProductInfoOpen(!isProductInfoOpen);
              if (!isProductInfoOpen) {
                dispatch(setSearchListTitle('Information'));
                navigation.setOptions({
                  headerLeft: () =>
                    <Icon style={{ fontSize: 35 }} name="chevron-back" onPress={() => {
                      dispatch(setSearchListTitle(previousTitle));
                      navigation.pop();
                    }} />
                });
              } else {
                dispatch(setSearchListTitle(previousTitle));
              };
            }}>
            <Text style={styles.textStyle}>{i18n.t('date_avaliable')}</Text>

            <Text style={styles.textStyle}>{avTime}</Text>

            {!isProductInfoOpen ? (
              <></>
            ) : (
              <>
                <Text style={{ marginTop: '3%' }}>{i18n.t('booking_consult')}</Text>
                <Text style={{ marginTop: '3%' }}>{i18n.t('search_place')}:</Text>
                <Text style={{ marginTop: '3%' }}>{i18n.t('booking_date')}</Text>

              </>
            )}
          </TouchableOpacity> */}