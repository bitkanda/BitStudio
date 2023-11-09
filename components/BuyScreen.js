import { FlatList, Button ,StyleSheet,View,Text,TouchableOpacity} from 'react-native';
import {useState} from 'react';

const BuyScreen = ({ route  }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [skus, getSkus] = useState(
        [
            {id:1, name: '月套餐', price: '10', times: '5', days: '30' },
            {id:2, name: '季套餐', price: '20', times: '10', days: '60' },
            {id:3, name: '半年套餐', price: '30', times: '15', days: '90' },
          ]
    );

   const renderPackageItem = ({ item }) =>{
    const isSelected = selectedItem && selectedItem.id === item.id;
    return (
        <TouchableOpacity
        style={[styles.listItem, isSelected && styles.selectedItem]}
        onPress={() => setSelectedItem(item)}
      >
       <View  style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 20 }}>
          <Text style={listItemStyle}>{item.name}</Text>
          <Text style={listItemStyle}>{item.price}元</Text>
          <Text style={listItemStyle}>提问{item.times}次</Text>
          <Text style={listItemStyle}>有效期 {item.days}天</Text>
        </View>
      </TouchableOpacity>
       
      );
    }
      
  return (
    <View >
    {/* <Text>购买页面</Text> */}
    <FlatList style={{marginTop:20}}
      data={skus}
      renderItem={renderPackageItem}
    //   ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item, index) => index.toString()}
    />
  <View   style={{  justifyContent: 'center', alignItems: 'center' }}>
  <View style={{ flexDirection: 'row' ,marginTop:20 }}>
    <Button
      title="微信支付"
      onPress={() => {
        // 处理微信支付逻辑
      }}
    />
      <View style={{ width: 20 }}></View>
    <Button
      title="礼品卡支付"
      onPress={() => {
        // 处理礼品卡支付逻辑
      }}
    />
    </View>
  </View>
 

  </View>
  );
};


const styles = StyleSheet.create({
    // separator: {
    //   height: 1,
    //   backgroundColor: 'gray',
    //   marginVertical: 10,
    // },

    listItem: {
        padding: 10,
       // borderBottomWidth: 1,
        borderBottomColor: 'gray',
      },
      selectedItem: {
        padding: 10,
       // borderBottomWidth: 1,
    
        backgroundColor: '#fff' // 背景颜色
      },
      itemText: {
        fontSize: 16,
      },

  });
// 定义样式对象
const listItemStyle =StyleSheet.create( {
    color: 'black',
    fontSize: 15
  });
export default BuyScreen;
