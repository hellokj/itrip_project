const areas = {
    '臺北市': [
        '中正區', '大同區', '中山區', '萬華區', '信義區', '松山區', '大安區', '南港區', '北投區', '內湖區', '士林區', '文山區'
    ],
    '新北市': [
        '板橋區', '新莊區', '泰山區', '林口區', '淡水區', '金山區', '八里區', '萬里區', '石門區', '三芝區', '瑞芳區', '汐止區', '平溪區', '貢寮區', '雙溪區', '深坑區', '石碇區', '新店區', '坪林區', '烏來區', '中和區', '永和區', '土城區', '三峽區', '樹林區', '鶯歌區', '三重區', '蘆洲區', '五股區'
    ],
    '基隆市': [
        '仁愛區', '中正區', '信義區', '中山區', '安樂區', '暖暖區', '七堵區'
    ],
    '桃園市': [
        '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '龜山區', '龍潭區', '大溪區', '大園區', '觀音區', '新屋區', '復興區'
    ],
    '新竹縣': [
        '竹北市', '竹東鎮', '新埔鎮', '關西鎮', '峨眉鄉', '寶山鄉', '北埔鄉', '橫山鄉', '芎林鄉', '湖口鄉', '新豐鄉', '尖石鄉', '五峰鄉'
    ],
    '新竹市': [
        '東區', '北區', '香山區'
    ],
    '苗栗縣': [
        '苗栗市', '通霄鎮', '苑裡鎮', '竹南鎮', '頭份鎮', '後龍鎮', '卓蘭鎮', '西湖鄉', '頭屋鄉', '公館鄉', '銅鑼鄉', '三義鄉', '造橋鄉', '三灣鄉', '南庄鄉', '大湖鄉', '獅潭鄉', '泰安鄉'
    ],
    '臺中市': [
        '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '東勢區', '石岡區', '新社區', '和平區', '神岡區', '潭子區', '大雅區', '大肚區', '龍井區', '沙鹿區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'
    ],
    '南投縣': [
        '南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'
    ],
    '彰化縣': [
        '彰化市', '員林鎮', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'
    ],
    '雲林縣': [
        '斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '莿桐鄉', '林內鄉', '古坑鄉', '大埤鄉', '崙背鄉', '二崙鄉', '麥寮鄉', '臺西鄉', '東勢鄉', '褒忠鄉', '四湖鄉', '口湖鄉', '水林鄉', '元長鄉'
    ],
    '嘉義縣': [
        '太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'
    ],
    '嘉義市': [
        '東區', '西區'
    ],
    '臺南市': [
        '中西區', '東區', ' 南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', ' 左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', ' 東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'
    ],
    '高雄市': [
        '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '前金區', '新興區', '苓雅區', '前鎮區', '小港區', '旗津區', '鳳山區', '大寮區', '鳥松區', '林園區', '仁武區', '大樹區', '大社區', '岡山區', '路竹區', '橋頭區', '梓官區', '彌陀區', '永安區', '燕巢區', '田寮區', '阿蓮區', '茄萣區', '湖內區', '旗山區', '美濃區', '內門區', '杉林區', '甲仙區', '六龜區', '茂林區', '桃源區', '那瑪夏區'
    ],
    '屏東縣': [
        '屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉', '三地門鄉'
    ],
    '宜蘭縣': [
        '宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'
    ],
    '花蓮縣': [
        '花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '秀林鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '富里鄉', '卓溪鄉'
    ],
    '臺東縣': [
        '臺東市', '成功鎮', '關山鎮', '長濱鄉', '海端鄉', '池上鄉', '東河鄉', '鹿野鄉', '延平鄉', '卑南鄉', '金峰鄉', '大武鄉', '達仁鄉', '綠島鄉', '蘭嶼鄉', '太麻里鄉'
    ],
    '澎湖縣': [
        '馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'
    ],
    '金門縣': [
        '金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'
    ],
    '連江縣': [
        '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
    ]
}

const types = {'美食':'gourmet', '購物':'shopping', '景點':'scenic spot', '交通':'transportation', '住宿':'lodging', '娛樂':'entertainment'};

const area_pics = {
    "北部":{
    '台北市': 'https://img.appledaily.com.tw/images/twapple/640pix/20160916/_Other/20160916vicsky_01.jpg',
    '新北市':'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_290_8.jpg',
    '基隆市':
    'https://cdn.walkerland.com.tw/images/upload/poi/p83880/m35474/cfe3697a349e529db06cea4525d488eebe2d7f2e.jpg',
    '桃園市':
    'https://i1.wp.com/taiwantour.info/wp-content/uploads/2018/02/1519194889-c94c08242b171ae1b1fc54dff2f5c6cc.jpg?fit=600%2C400&ssl=1',
    '新竹縣':
    'https://cdntwrunning.biji.co/800_db5a86e80407007c12a7fde66f1b57a9.jpg' 
    },
    '中部':{
    '苗栗縣':'https://i4.achangpro.com/img.nanai.tw/pixnet/e5f35d383866d880051af1379ac37407.jpg',
    '台中市':'https://www.funtime.com.tw/blog/wp-content/uploads/2016/09/183-1024x648.jpg',
    '彰化縣':'https://img.ikiwi.tw/uploads/20171222205234_47.jpg',
    '南投縣':'https://i0.wp.com/blog.tripbaa.com/wp-content/uploads/2017/11/8627416075_2393b6d3b3_b_d1.jpg?fit=1024%2C683&ssl=1'
    },
    '南部':{
    '雲林縣':'https://image.cache.storm.mg/styles/smg-800x533-fp/s3/media/image/2018/03/19/20180319-040857_U10330_M392901_106c.jpg?itok=G4E2_t4b',
    '嘉義縣' : 'https://travelimg.yamedia.tw/20180811/20180812191239556.jpg',
    '台南市' : 'https://i0.wp.com/blog.tripbaa.com/wp-content/uploads/2018/01/4-4.jpg?fit=960%2C639&ssl=1',
    '高雄市' : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThb-5dqscfsmyBmWuZ4EHixsmqyV_L0dURNnqPmj35eHFjNLqx',
    '屏東縣' : 'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_421_15.jpg' 
    },
    '東部':{
    '宜蘭縣' : 'https://i2.achangpro.com/img.bobowin.blog/uploads/20180105212137_2.jpg',
    '花蓮縣' : 'https://gsimg.asiayo.com/ay-image-upload/1556183794966_%E5%A4%A7%E9%BC%BB%E5%B1%B1%E6%AD%A5%E9%81%93.jpg',
    '台東縣' : 'https://d2j3coy501s4ze.cloudfront.net/images/22264/700/c4c23259940137cf572a3d290d565368591f1584_587d9b31caccd.jpeg'
    },
    '離島':{
    '澎湖縣' : 'https://i2.wp.com/img.journey.tw/20180415140944_25.jpg?resize=1100%2C733&ssl=1',
    '金門縣' : 'https://b.blog.xuite.net/b/2/d/e/12584724/blog_32120/txt/66780927/49.jpg',
    '連江縣' : 'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_196_7.jpg'
    }
    
    };

const getAreas = () => {
    let areaArr = Object.keys(areas);
    return areaArr.map((v)=>({
        id: v,
        label: v,
        children: areas[v].map((v_child) => ({
            id: v.concat('-',v_child),
            parentId: v,
            label: v_child
        }))
    }));
}

const getTypes = () => {
    let typeArr = Object.keys(types);
    return typeArr.map((v) => ({
        id: types[v],
        label: v
    }));
}

const getAreaPics = () => {
    return area_pics;
}

const paramsHelper = (params, values) => {
    let result = {};
    for(let i=0;i<params.length;i++) {
        if(values[i] != null && values[i] != "") {
            result[params[i]] = values[i]
        }

    }
    return result;
}

const makeParams = (city = null, region = null, _category = null, _name = null, _sortBy = "ig_post_num", _page = 1, _limit = 10, _order = -1) => {
    let _region = region;
    let _city = city;
    // if (region != null && region.length >= 4) {
    //     _region = _region.slice(4, region.length);
    // }
    // else {
    //     _city = region;
    //     _region = null;
    // }

    // search for type or name
    // let name = null;
    // let _tmpcategory = null;
    // let typeValues = Object.values(types);
    // if(typeValues.indexOf(_category) != -1) {
    //     _tmpcategory = _category;
    // } else {
    //     _tmpcategory = null;
    //     name = _category
    // }        
    
    return paramsHelper(['city', 'region', 'categories', 'name', 'sortBy', 'page', 'limit', 'order'],
                        [_city, _region, _category, _name, _sortBy, _page, _limit, _order]);
}

export {
    types,
    getAreas,
    getTypes,
    makeParams,
    getAreaPics
}