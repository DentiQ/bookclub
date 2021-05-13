import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import {Picker} from '@react-native-picker/picker';
import ScheduleList from '../components/ScheduleList';
import { getClubInfo, DB, getCurrentUser } from '../utils/firebase';
import moment from 'moment';


const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const ContainerRow=styled.View`
    width: ${({width})=>width}px;
    height: 60px;
    flex-direction: row;
    background-color: ${({theme})=>theme.background};
    align-items: center;
    justify-content: center;
    borderBottom-Width: 1px;
    borderBottom-Color: ${({theme})=>theme.separator};
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const Header=styled.View`
    width: ${({width})=>width}px;
    height: 80px;
    background-color: ${({theme})=>theme.background};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    borderBottom-color: ${({theme})=>theme.appBackground};
    borderBottom-width: 3px;
    padding: 0;
`;

const styles = StyleSheet.create({
    clubname: {
      fontSize: 25,
      color: theme.text,
    },
  });


const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>

        <Text style={styles.clubname}>{clubname}</Text>

        </Header>
    )
};


//더미데이터에서는 일정에 대한 구분을 월/일 로 해두었습니다.
//picker을 통해 연도를 설정할 수 있기 때문에 실제로는 연/월/일로 구분하는게 옳다고 생각하나,
//firebase db에 미숙하기 때문에 확언이 어렵습니다... 사용이 용이한 쪽으로 변형해주시면 될 것 같습니다.
const tempData = {
    "clubname": "SEORAP",
    "booktitle": "보노보노, 오늘 하루는 어땠어?",
    "goal": 226,
    "schedule":[
        {
            "id": 1,
            "month": "Apr",
            "date": 2,
            "time": "8:00",
            "place": "zoom",
            "memo": "필참입니다. 너무 늦지 않도록 해주세요.",
        },
        {
            "id": 2,
            "month": "May",
            "date": 12,
            "time": "8:30",
            "place": "zoom",
            "memo": "",
        },
        {
            "id": 3,
            "month": "May",
            "date": 14,
            "time": "9:00",
            "place": "zoom",
            "memo": "특이사항 추후 수정 예정입니다. 시간이 변동될 수 있으니 주의해주세요.",
        },
        {
            "id": 4,
            "month": "May",
            "date": 19,
            "time": "17:00",
            "place": "zoom",
            "memo": "독서록 준비",
        },
        {
            "id": 5,
            "month": "May",
            "date": 20,
            "time": "23:30",
            "place": "zoom",
            "memo": "",
        },
        {
            "id": 6,
            "month": "May",
            "date": 24,
            "time": "10:00",
            "place": "zoom",
            "memo": "",
        },
        {
            "id": 7,
            "month": "May",
            "date": 30,
            "time": "8:00",
            "place": "zoom",
            "memo": "특이사항 추후 수정 예정입니다.",
        },
    ]
}



const MyClubScheduleListT=({ navigation, route })=>{
    const id = route.params?.id;
    const clubname = route.params.clubname;
    const width= Dimensions.get('window').width;
    const [selectedMonth, setSelectedMonth] = useState("05");  //이부분을 현재 app을 가동한 시간의 date를 통해 월 값을 가져올 수 있을지....?
    const [selectedYear, setSelectedYear] = useState("2021");  //이부분을 현재 app을 가동한 시간의 year을 통해 월 값을 가져올 수 있을지....?
    const [schedule, setSchedule] = useState([]);
    const [filtered, setFiltered] = useState({
      clubname: "",
      schedule: []
    });

    const getSchedule = async() => {
      try{
        const scheduleRef = DB.collection('clubs').doc(id).collection('schedule');
        const scheduleDoc = await scheduleRef.orderBy('date').get();
        const list = [];
        scheduleDoc.forEach(doc => {
          const data = doc.data();
          const now = moment().startOf('day');
          console.log(data);
          const tempschedule = {
            id: data.id,
            clubId: id,
            year: moment(data.date.toDate()).format('YYYY'),
            month: moment(data.date.toDate()).format('MM'),
            date: moment(data.date.toDate()).format('DD'),
            time: moment(data.date.toDate()).format('hh:mm'),
            place: data.site,
            title: data.title,
            memo: data.memo,
          }
          console.log(moment(data.date.toDate()).format('YYYY MM DD HH:mm'));
          list.push(tempschedule);
        })
        setSchedule(list);
      }
      catch(e) {
        Alert.alert("스케쥴 수신 에러", e.message);
      }
    };

    const filterSchedule = async() => {
      const temp = {
        clubname: route.params.title,
        schedule: [],
      };
      for (let sch of schedule) {
        if (sch.year == selectedYear && sch.month == selectedMonth) {
          temp.schedule.push(sch);
          console.log(sch);
        }
      };
      setFiltered(temp);
    }

    useEffect(()=> {
      getSchedule();
    }, []);

    useEffect(() => {
      filterSchedule();
    }, [schedule, selectedYear, selectedMonth]);

    useEffect(() => {
      console.log("filtered", filtered);
    }, [filtered]);

    return (
      <KeyboardAwareScrollView
          contentContainerStyle={{flex: 1}}
          extraScrollHeight={20}
      >
      <Container>
          <MainHeader clubname={filtered.clubname}></MainHeader>
          <ContainerRow width={width}>

          <Picker
              selectedValue={selectedYear}
              style={{ height: 50, width: 110, margin: 10 }}
              onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}>
              <Picker.Item label="2021" value="2021" />
              <Picker.Item label="2022" value="2022" />
              <Picker.Item label="2023" value="2023" />
              <Picker.Item label="2024" value="2024" />
              <Picker.Item label="2025" value="2025" />
          </Picker>
          <Picker
              selectedValue={selectedMonth}
              style={{ height: 50, width: 100, margin: 10 }}
              onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}>
              <Picker.Item label="Jan." value="01" />
              <Picker.Item label="Feb." value="02" />
              <Picker.Item label="Mar." value="03" />
              <Picker.Item label="Apr." value="04" />
              <Picker.Item label="May." value="05" />
              <Picker.Item label="Jun." value="06" />
              <Picker.Item label="Jul." value="07" />
              <Picker.Item label="Aug." value="08" />
              <Picker.Item label="Sept." value="09" />
              <Picker.Item label="Oct." value="10" />
              <Picker.Item label="Nov." value="11" />
              <Picker.Item label="Dec." value="12" />
          </Picker>

          </ContainerRow>

          {filtered.schedule.length > 0 ? (
            <List width={width}>
              <ScheduleList scheduleInfo={filtered} selectedYear={selectedYear} selectedMonth={selectedMonth}></ScheduleList>
            </List>
            )
            : (
            <Container>
              <Text>이번달 일정이 없습니다!</Text>
            </Container>
          )}

      </Container>
      </KeyboardAwareScrollView>
    );

  };


export default MyClubScheduleListT;
