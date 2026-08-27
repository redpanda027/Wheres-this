'use strict';

/* ================================================================
   日本どこでしょう？ - game.js

   構成:
     1. 出題データ
     2. Leaflet読み込み
     3. アプリ状態
     4. 初期化 / DOM要素キャッシュ
     5. 画面切り替え・サイドメニュー
     6. 設定
     7. ゲーム開始・ラウンド進行
     8. 写真マップ（出題側）
     9. 回答マップ
     10. 回答送信・採点・結果モーダル
     11. 結果画面（最終）
     12. ヒント・終了確認モーダル
     13. 通知・ユーティリティ
     14. キーボード操作
   ================================================================ */


/* ================================================================
   1. 出題データ
   ================================================================ */

const LOCATIONS = [
    { name: '東京駅', answers: ['東京', '東京駅'], pref: '東京都', region: '関東地方', lat: 35.681236, lng: 139.767125 },
    { name: '大阪城', answers: ['大阪', '大阪城'], pref: '大阪府', region: '近畿地方', lat: 34.687315, lng: 135.526201 },
    { name: '清水寺', answers: ['清水寺', '清水'], pref: '京都府', region: '近畿地方', lat: 34.994856, lng: 135.785046 },
    { name: '札幌時計台', answers: ['札幌時計台', '時計台', '札幌'], pref: '北海道', region: '北海道地方', lat: 43.063968, lng: 141.353688 },
    { name: '博多駅', answers: ['博多', '博多駅'], pref: '福岡県', region: '九州・沖縄地方', lat: 33.590355, lng: 130.420913 },
    { name: '首里城跡', answers: ['首里城', '首里城跡', '首里'], pref: '沖縄県', region: '九州・沖縄地方', lat: 26.216667, lng: 127.719444 },
    { name: '原爆ドーム', answers: ['原爆ドーム', '原爆ドーム広島'], pref: '広島県', region: '中国地方', lat: 34.395555, lng: 132.453833 },
    { name: '名古屋城', answers: ['名古屋', '名古屋城'], pref: '愛知県', region: '中部地方', lat: 35.185556, lng: 136.899722 },
    { name: '仙台城跡', answers: ['仙台城', '仙台城跡', '青葉城'], pref: '宮城県', region: '東北地方', lat: 38.253611, lng: 140.856944 },
    { name: '兼六園', answers: ['兼六園', '金沢兼六園'], pref: '石川県', region: '中部地方', lat: 36.562222, lng: 136.662500 },
    { name: '松本城', answers: ['松本', '松本城'], pref: '長野県', region: '中部地方', lat: 36.238333, lng: 137.968889 },
    { name: '富士山本宮浅間大社', answers: ['浅間大社', '富士山本宮浅間大社', '富士山本宮'], pref: '静岡県', region: '中部地方', lat: 35.222000, lng: 138.616000 },
    { name: '鎌倉大仏', answers: ['鎌倉', '鎌倉大仏', '大仏'], pref: '神奈川県', region: '関東地方', lat: 35.316700, lng: 139.535300 },
    { name: '東大寺', answers: ['東大寺', '奈良東大寺'], pref: '奈良県', region: '近畿地方', lat: 34.688900, lng: 135.839800 },
    { name: '岡山城', answers: ['岡山', '岡山城'], pref: '岡山県', region: '中国地方', lat: 34.665800, lng: 133.935800 },
    { name: '栗林公園', answers: ['栗林公園', '高松栗林公園'], pref: '香川県', region: '四国地方', lat: 34.329700, lng: 134.057600 },
    { name: '熊本城', answers: ['熊本', '熊本城'], pref: '熊本県', region: '九州・沖縄地方', lat: 32.806400, lng: 130.705900 },
    { name: '弘前城', answers: ['弘前', '弘前城'], pref: '青森県', region: '東北地方', lat: 40.607300, lng: 140.463800 },
    { name: '錦帯橋', answers: ['錦帯橋', '岩国錦帯橋', '岩国'], pref: '山口県', region: '中国地方', lat: 34.166700, lng: 132.183300 },
    { name: '鳥取砂丘', answers: ['鳥取', '鳥取砂丘'], pref: '鳥取県', region: '中国地方', lat: 35.538900, lng: 134.230600 },
    { name: '浅草寺', answers: ['浅草寺', '浅草', '雷門'], pref: '東京都', region: '関東地方', lat: 35.714765, lng: 139.796655 },
    { name: '東京タワー', answers: ['東京タワー', 'タワー'], pref: '東京都', region: '関東地方', lat: 35.658581, lng: 139.745433 },
    { name: '東京スカイツリー', answers: ['東京スカイツリー', 'スカイツリー'], pref: '東京都', region: '関東地方', lat: 35.710063, lng: 139.810700 },
    { name: '明治神宮', answers: ['明治神宮', '明治神宮前'], pref: '東京都', region: '関東地方', lat: 35.676397, lng: 139.699325 },
    { name: '皇居', answers: ['皇居', '東京皇居'], pref: '東京都', region: '関東地方', lat: 35.685176, lng: 139.752800 },
    { name: '国立競技場', answers: ['国立競技場', '新国立競技場'], pref: '東京都', region: '関東地方', lat: 35.677800, lng: 139.714300 },
    { name: '横浜ランドマークタワー', answers: ['横浜ランドマークタワー', 'ランドマークタワー', '横浜ランドマーク'], pref: '神奈川県', region: '関東地方', lat: 35.454800, lng: 139.631500 },
    { name: '鎌倉鶴岡八幡宮', answers: ['鶴岡八幡宮', '鎌倉八幡宮', '鎌倉'], pref: '神奈川県', region: '関東地方', lat: 35.325100, lng: 139.556700 },
    { name: '日光東照宮', answers: ['日光東照宮', '東照宮', '日光'], pref: '栃木県', region: '関東地方', lat: 36.758000, lng: 139.598900 },
    { name: '国営ひたち海浜公園', answers: ['ひたち海浜公園', 'ネモフィラ公園', 'ひたち海浜'], pref: '茨城県', region: '関東地方', lat: 36.405600, lng: 140.601800 },
    { name: '川越氷川神社', answers: ['川越氷川神社', '氷川神社', '川越'], pref: '埼玉県', region: '関東地方', lat: 35.925100, lng: 139.485800 },
    { name: '成田山新勝寺', answers: ['成田山新勝寺', '成田山', '新勝寺'], pref: '千葉県', region: '関東地方', lat: 35.785300, lng: 140.318700 },
    { name: '彌彦神社', answers: ['彌彦神社', '弥彦神社', '弥彦'], pref: '新潟県', region: '中部地方', lat: 37.691500, lng: 138.826400 },
    { name: '黒部ダム', answers: ['黒部ダム', '黒部'], pref: '富山県', region: '中部地方', lat: 36.561100, lng: 137.662800 },
    { name: '白川郷', answers: ['白川郷', '白川郷合掌造り', '合掌造り'], pref: '岐阜県', region: '中部地方', lat: 36.257100, lng: 136.906600 },
    { name: '高山古い町並', answers: ['高山古い町並', '飛騨高山', '高山'], pref: '岐阜県', region: '中部地方', lat: 36.140800, lng: 137.257400 },
    { name: '熱田神宮', answers: ['熱田神宮', '熱田'], pref: '愛知県', region: '中部地方', lat: 35.126400, lng: 136.908100 },
    { name: '犬山城', answers: ['犬山城', '犬山'], pref: '愛知県', region: '中部地方', lat: 35.388000, lng: 136.939500 },
    { name: '浜名湖', answers: ['浜名湖', '浜松浜名湖'], pref: '静岡県', region: '中部地方', lat: 34.747700, lng: 137.603100 },
    { name: '三保松原', answers: ['三保松原', '三保の松原', '三保'], pref: '静岡県', region: '中部地方', lat: 34.997700, lng: 138.519100 },
    { name: '富士山五合目', answers: ['富士山五合目', '富士山', '五合目'], pref: '山梨県', region: '中部地方', lat: 35.360600, lng: 138.727400 },
    { name: '上高地', answers: ['上高地', '河童橋'], pref: '長野県', region: '中部地方', lat: 36.248100, lng: 137.634600 },
    { name: '善光寺', answers: ['善光寺', '長野善光寺'], pref: '長野県', region: '中部地方', lat: 36.661300, lng: 138.187400 },
    { name: '諏訪大社', answers: ['諏訪大社', '諏訪'], pref: '長野県', region: '中部地方', lat: 36.030100, lng: 138.116600 },
    { name: '東尋坊', answers: ['東尋坊', '福井東尋坊'], pref: '福井県', region: '中部地方', lat: 36.239800, lng: 136.125600 },
    { name: '永平寺', answers: ['永平寺', '福井永平寺'], pref: '福井県', region: '中部地方', lat: 36.054400, lng: 136.347300 },
    { name: '彦根城', answers: ['彦根城', '彦根'], pref: '滋賀県', region: '近畿地方', lat: 35.276900, lng: 136.251500 },
    { name: '平等院', answers: ['平等院', '平等院鳳凰堂', '宇治'], pref: '京都府', region: '近畿地方', lat: 34.889400, lng: 135.807700 },
    { name: '金閣寺', answers: ['金閣寺', '鹿苑寺', '金閣'], pref: '京都府', region: '近畿地方', lat: 35.039400, lng: 135.729200 },
    { name: '伏見稲荷大社', answers: ['伏見稲荷大社', '伏見稲荷', '千本鳥居'], pref: '京都府', region: '近畿地方', lat: 34.967100, lng: 135.772700 },
    { name: '嵐山竹林', answers: ['嵐山竹林', '竹林の小径', '嵐山'], pref: '京都府', region: '近畿地方', lat: 35.017000, lng: 135.671300 },
    { name: '大阪城公園', answers: ['大阪城公園', '大阪城'], pref: '大阪府', region: '近畿地方', lat: 34.687300, lng: 135.526200 },
    { name: '通天閣', answers: ['通天閣', '新世界'], pref: '大阪府', region: '近畿地方', lat: 34.652500, lng: 135.506300 },
    { name: '海遊館', answers: ['海遊館', '大阪海遊館'], pref: '大阪府', region: '近畿地方', lat: 34.654500, lng: 135.428900 },
    { name: '姫路城', answers: ['姫路城', '白鷺城', '姫路'], pref: '兵庫県', region: '近畿地方', lat: 34.839400, lng: 134.693900 },
    { name: '明石海峡大橋', answers: ['明石海峡大橋', '明石大橋', '明石海峡'], pref: '兵庫県', region: '近畿地方', lat: 34.616000, lng: 135.021700 },
    { name: '有馬温泉', answers: ['有馬温泉', '有馬'], pref: '兵庫県', region: '近畿地方', lat: 34.796500, lng: 135.246800 },
    { name: '法隆寺', answers: ['法隆寺', '斑鳩'], pref: '奈良県', region: '近畿地方', lat: 34.614900, lng: 135.734100 },
    { name: '春日大社', answers: ['春日大社', '奈良春日大社', '春日大社奈良'], pref: '奈良県', region: '近畿地方', lat: 34.681400, lng: 135.848100 },
    { name: '高野山金剛峰寺', answers: ['高野山金剛峰寺', '金剛峰寺', '高野山'], pref: '和歌山県', region: '近畿地方', lat: 34.213100, lng: 135.585600 },
    { name: '和歌山城', answers: ['和歌山城', '和歌山'], pref: '和歌山県', region: '近畿地方', lat: 34.226100, lng: 135.167500 },
    { name: '出雲大社', answers: ['出雲大社', '出雲'], pref: '島根県', region: '中国地方', lat: 35.402000, lng: 132.685200 },
    { name: '松江城', answers: ['松江城', '松江'], pref: '島根県', region: '中国地方', lat: 35.474700, lng: 133.050500 },
    { name: '足立美術館', answers: ['足立美術館', '安来足立美術館'], pref: '島根県', region: '中国地方', lat: 35.379600, lng: 133.193700 },
    { name: '倉敷美観地区', answers: ['倉敷美観地区', '倉敷', '美観地区'], pref: '岡山県', region: '中国地方', lat: 34.596600, lng: 133.771700 },
    { name: '宮島厳島神社', answers: ['宮島厳島神社', '厳島神社', '宮島'], pref: '広島県', region: '中国地方', lat: 34.295900, lng: 132.319900 },
    { name: '広島城', answers: ['広島城', '鯉城'], pref: '広島県', region: '中国地方', lat: 34.402700, lng: 132.459600 },
    { name: '錦帯橋公園', answers: ['錦帯橋公園', '錦帯橋', '岩国'], pref: '山口県', region: '中国地方', lat: 34.167000, lng: 132.178600 },
    { name: '秋芳洞', answers: ['秋芳洞', '秋吉台', '秋芳洞秋吉台'], pref: '山口県', region: '中国地方', lat: 34.227900, lng: 131.304200 },
    { name: '鳴門の渦潮', answers: ['鳴門の渦潮', '鳴門', '渦潮'], pref: '徳島県', region: '四国地方', lat: 34.232400, lng: 134.646300 },
    { name: '大塚国際美術館', answers: ['大塚国際美術館', '大塚美術館'], pref: '徳島県', region: '四国地方', lat: 34.243500, lng: 134.629000 },
    { name: '道後温泉', answers: ['道後温泉', '道後'], pref: '愛媛県', region: '四国地方', lat: 33.852000, lng: 132.786800 },
    { name: '松山城', answers: ['松山城', '松山'], pref: '愛媛県', region: '四国地方', lat: 33.845600, lng: 132.765700 },
    { name: '桂浜', answers: ['桂浜', '高知桂浜', '高知'], pref: '高知県', region: '四国地方', lat: 33.499700, lng: 133.571000 },
    { name: '高知城', answers: ['高知城', '高知'], pref: '高知県', region: '四国地方', lat: 33.559700, lng: 133.531100 },
    { name: '金刀比羅宮', answers: ['金刀比羅宮', 'こんぴらさん', '琴平'], pref: '香川県', region: '四国地方', lat: 34.185100, lng: 133.814400 },
    { name: '太宰府天満宮', answers: ['太宰府天満宮', '太宰府'], pref: '福岡県', region: '九州・沖縄地方', lat: 33.521500, lng: 130.534700 },
    { name: '福岡タワー', answers: ['福岡タワー', '福岡'], pref: '福岡県', region: '九州・沖縄地方', lat: 33.593200, lng: 130.351700 },
    { name: '吉野ヶ里遺跡', answers: ['吉野ヶ里遺跡', '吉野ヶ里'], pref: '佐賀県', region: '九州・沖縄地方', lat: 33.321600, lng: 130.384000 },
    { name: 'ハウステンボス', answers: ['ハウステンボス', '佐世保ハウステンボス'], pref: '長崎県', region: '九州・沖縄地方', lat: 33.095800, lng: 129.784900 },
    { name: '長崎平和公園', answers: ['長崎平和公園', '平和公園', '長崎'], pref: '長崎県', region: '九州・沖縄地方', lat: 32.773100, lng: 129.863000 },
    { name: '熊本城公園', answers: ['熊本城公園', '熊本城', '熊本'], pref: '熊本県', region: '九州・沖縄地方', lat: 32.806200, lng: 130.705800 },
    { name: '阿蘇山', answers: ['阿蘇山', '阿蘇'], pref: '熊本県', region: '九州・沖縄地方', lat: 32.884700, lng: 131.104900 },
    { name: '別府地獄めぐり', answers: ['別府地獄めぐり', '別府地獄', '別府'], pref: '大分県', region: '九州・沖縄地方', lat: 33.314800, lng: 131.469700 },
    { name: '高千穂峡', answers: ['高千穂峡', '高千穂'], pref: '宮崎県', region: '九州・沖縄地方', lat: 32.704600, lng: 131.307200 },
    { name: '仙巌園', answers: ['仙巌園', '磯庭園', '鹿児島仙巌園'], pref: '鹿児島県', region: '九州・沖縄地方', lat: 31.623200, lng: 130.578000 },
    { name: '桜島', answers: ['桜島', '鹿児島桜島'], pref: '鹿児島県', region: '九州・沖縄地方', lat: 31.593200, lng: 130.657000 },
    { name: '美ら海水族館', answers: ['美ら海水族館', '沖縄美ら海水族館', '美ら海'], pref: '沖縄県', region: '九州・沖縄地方', lat: 26.694200, lng: 127.877100 },
    { name: '国際通り', answers: ['国際通り', '那覇国際通り', '那覇'], pref: '沖縄県', region: '九州・沖縄地方', lat: 26.214500, lng: 127.681100 },
    { name: '竹富島', answers: ['竹富島', '竹富'], pref: '沖縄県', region: '九州・沖縄地方', lat: 24.331800, lng: 124.085900 },
    { name: '五稜郭', answers: ['五稜郭', '五稜郭公園'], pref: '北海道', region: '北海道地方', lat: 41.796900, lng: 140.756700 },
    { name: '小樽運河', answers: ['小樽運河', '小樽'], pref: '北海道', region: '北海道地方', lat: 43.197300, lng: 140.994700 },
    { name: '旭山動物園', answers: ['旭山動物園', '旭山動物公園', '旭川'], pref: '北海道', region: '北海道地方', lat: 43.768700, lng: 142.480400 },
    { name: '知床五湖', answers: ['知床五湖', '知床'], pref: '北海道', region: '北海道地方', lat: 44.123700, lng: 145.097800 },
    { name: '三内丸山遺跡', answers: ['三内丸山遺跡', '三内丸山'], pref: '青森県', region: '東北地方', lat: 40.811600, lng: 140.699700 },
    { name: '中尊寺金色堂', answers: ['中尊寺金色堂', '中尊寺', '金色堂'], pref: '岩手県', region: '東北地方', lat: 39.001100, lng: 141.099600 },
    { name: '山寺立石寺', answers: ['山寺立石寺', '立石寺', '山寺'], pref: '山形県', region: '東北地方', lat: 38.312500, lng: 140.434600 },
    { name: '大内宿', answers: ['大内宿', '会津大内宿'], pref: '福島県', region: '東北地方', lat: 37.297100, lng: 139.860300 },
    { name: '五色沼', answers: ['五色沼', '五色沼湖沼群'], pref: '福島県', region: '東北地方', lat: 37.644400, lng: 140.084700 },
    { name: '松島', answers: ['松島', '松島湾'], pref: '宮城県', region: '東北地方', lat: 38.367000, lng: 141.056900 },
    { name: '角館武家屋敷', answers: ['角館武家屋敷', '角館', '武家屋敷'], pref: '秋田県', region: '東北地方', lat: 39.596400, lng: 140.562600 },
    { name: '立石寺', answers: ['立石寺', '山寺'], pref: '山形県', region: '東北地方', lat: 38.312500, lng: 140.434600 },
    { name: '尾瀬ヶ原', answers: ['尾瀬ヶ原', '尾瀬'], pref: '群馬県', region: '関東地方', lat: 36.936000, lng: 139.238000 },
    { name: '草津温泉', answers: ['草津温泉', '草津'], pref: '群馬県', region: '関東地方', lat: 36.622400, lng: 138.596100 },
    { name: '大橋ジャンクション', answers: ['大橋ジャンクション', '大橋JCT', '大橋'], pref: '東京都', region: '関東地方', lat: 35.642700, lng: 139.684300 },
    { name: '箱崎ジャンクション', answers: ['箱崎ジャンクション', '箱崎JCT', '箱崎'], pref: '東京都', region: '関東地方', lat: 35.681800, lng: 139.786500 },
    { name: '江北ジャンクション', answers: ['江北ジャンクション', '江北JCT', '江北'], pref: '東京都', region: '関東地方', lat: 35.764500, lng: 139.764000 },
    { name: '川口ジャンクション', answers: ['川口ジャンクション', '川口JCT', '川口'], pref: '埼玉県', region: '関東地方', lat: 35.847000, lng: 139.750500 },
    { name: '三郷ジャンクション', answers: ['三郷ジャンクション', '三郷JCT', '三郷'], pref: '埼玉県', region: '関東地方', lat: 35.846400, lng: 139.875600 },
    { name: '美女木ジャンクション', answers: ['美女木ジャンクション', '美女木JCT', '美女木'], pref: '埼玉県', region: '関東地方', lat: 35.817000, lng: 139.644000 },
    { name: '厚木インターチェンジ', answers: ['厚木インターチェンジ', '厚木IC', '厚木インター'], pref: '神奈川県', region: '関東地方', lat: 35.445000, lng: 139.363500 },
    { name: '八王子ジャンクション', answers: ['八王子ジャンクション', '八王子JCT', '八王子'], pref: '東京都', region: '関東地方', lat: 35.655500, lng: 139.267500 },
    { name: '小牧ジャンクション', answers: ['小牧ジャンクション', '小牧JCT', '小牧'], pref: '愛知県', region: '中部地方', lat: 35.314000, lng: 136.941000 },
    { name: '吹田ジャンクション', answers: ['吹田ジャンクション', '吹田JCT', '吹田'], pref: '大阪府', region: '近畿地方', lat: 34.803500, lng: 135.530500 },
    { name: '西宮ジャンクション', answers: ['西宮ジャンクション', '西宮JCT', '西宮'], pref: '兵庫県', region: '近畿地方', lat: 34.738500, lng: 135.342500 },
    { name: '東大阪ジャンクション', answers: ['東大阪ジャンクション', '東大阪JCT', '東大阪'], pref: '大阪府', region: '近畿地方', lat: 34.681500, lng: 135.609500 },
    { name: '栗東インターチェンジ', answers: ['栗東インターチェンジ', '栗東IC', '栗東インター'], pref: '滋賀県', region: '近畿地方', lat: 35.009000, lng: 136.010000 },
    { name: '日光山輪王寺', answers: ['日光山輪王寺', '輪王寺', '日光輪王寺'], pref: '栃木県', region: '関東地方', lat: 36.755800, lng: 139.599600 },
    { name: '松本城天守', answers: ['松本城天守', '松本城', '国宝松本城'], pref: '長野県', region: '中部地方', lat: 36.238700, lng: 137.968900 },
    { name: '犬山城天守', answers: ['犬山城天守', '犬山城', '国宝犬山城'], pref: '愛知県', region: '中部地方', lat: 35.388000, lng: 136.939500 },
    { name: '彦根城天守', answers: ['彦根城天守', '彦根城', '国宝彦根城'], pref: '滋賀県', region: '近畿地方', lat: 35.276900, lng: 136.251500 },
    { name: '松江城天守', answers: ['松江城天守', '松江城', '国宝松江城'], pref: '島根県', region: '中国地方', lat: 35.474700, lng: 133.050500 },
    { name: '瑠璃光寺五重塔', answers: ['瑠璃光寺五重塔', '瑠璃光寺', '五重塔'], pref: '山口県', region: '中国地方', lat: 34.189800, lng: 131.473800 },
    { name: '瑞龍寺', answers: ['瑞龍寺', '高岡瑞龍寺'], pref: '富山県', region: '中部地方', lat: 36.737500, lng: 137.012600 },
    { name: '本願寺御影堂', answers: ['本願寺御影堂', '西本願寺', '本願寺'], pref: '京都府', region: '近畿地方', lat: 34.991300, lng: 135.752700 },
    { name: '東大寺大仏殿', answers: ['東大寺大仏殿', '大仏殿', '東大寺'], pref: '奈良県', region: '近畿地方', lat: 34.688900, lng: 135.839800 },
    { name: '中尊寺本堂', answers: ['中尊寺本堂', '中尊寺', '平泉'], pref: '岩手県', region: '東北地方', lat: 39.001100, lng: 141.099600 },
    { name: '富岡製糸場', answers: ['富岡製糸場', '富岡製糸場跡', '富岡'], pref: '群馬県', region: '関東地方', lat: 36.255000, lng: 138.887000 },
    { name: '軍艦島', answers: ['軍艦島', '端島', '端島炭坑'], pref: '長崎県', region: '九州・沖縄地方', lat: 32.627800, lng: 129.738300 },
    { name: '石見銀山遺跡', answers: ['石見銀山遺跡', '石見銀山', '大森'], pref: '島根県', region: '中国地方', lat: 35.111700, lng: 132.435300 },
    { name: '原爆ドーム世界遺産', answers: ['原爆ドーム世界遺産', '原爆ドーム', '広島原爆ドーム'], pref: '広島県', region: '中国地方', lat: 34.395500, lng: 132.453600 },
    { name: '白神山地', answers: ['白神山地', '白神'], pref: '青森県', region: '東北地方', lat: 40.473000, lng: 140.120000 },
    { name: '屋久島縄文杉', answers: ['屋久島縄文杉', '縄文杉', '屋久島'], pref: '鹿児島県', region: '九州・沖縄地方', lat: 30.360000, lng: 130.510000 },
    { name: '小笠原諸島父島', answers: ['小笠原諸島父島', '父島', '小笠原諸島'], pref: '東京都', region: '関東地方', lat: 27.095000, lng: 142.190000 },
    { name: '佐渡島', answers: ['佐渡島', '佐渡'], pref: '新潟県', region: '中部地方', lat: 38.050000, lng: 138.350000 },
    { name: '淡路島', answers: ['淡路島', '淡路'], pref: '兵庫県', region: '近畿地方', lat: 34.350000, lng: 134.800000 },
    { name: '瀬戸大橋与島', answers: ['瀬戸大橋与島', '与島', '瀬戸大橋'], pref: '香川県', region: '四国地方', lat: 34.390000, lng: 133.820000 },
    { name: '直島', answers: ['直島', '直島アート'], pref: '香川県', region: '四国地方', lat: 34.460000, lng: 133.995000 },
    { name: '宮島', answers: ['宮島', '厳島', '宮島島'], pref: '広島県', region: '中国地方', lat: 34.295000, lng: 132.320000 },
    { name: '西表島', answers: ['西表島', '西表'], pref: '沖縄県', region: '九州・沖縄地方', lat: 24.350000, lng: 123.820000 },
    { name: '石垣島川平湾', answers: ['石垣島川平湾', '川平湾', '石垣島'], pref: '沖縄県', region: '九州・沖縄地方', lat: 24.456000, lng: 124.146000 },
    { name: '宮古島与那覇前浜', answers: ['宮古島与那覇前浜', '与那覇前浜', '宮古島'], pref: '沖縄県', region: '九州・沖縄地方', lat: 24.738000, lng: 125.273000 },
    { name: '佐世保九十九島', answers: ['佐世保九十九島', '九十九島', '佐世保'], pref: '長崎県', region: '九州・沖縄地方', lat: 33.150000, lng: 129.620000 }
    ,{ name: '大山崎ジャンクション', answers: ['大山崎ジャンクション', '大山崎JCT', '大山崎'], pref: '京都府', region: '近畿地方', lat: 34.909000, lng: 135.688000 }
    ,{ name: '新宿駅', answers: ['新宿駅', '新宿'], pref: '東京都', region: '関東地方', lat: 35.689600, lng: 139.700600 }
    ,{ name: '品川駅', answers: ['品川駅', '品川'], pref: '東京都', region: '関東地方', lat: 35.628500, lng: 139.738800 }
    ,{ name: '上野駅', answers: ['上野駅', '上野'], pref: '東京都', region: '関東地方', lat: 35.713800, lng: 139.777300 }
    ,{ name: '横浜駅', answers: ['横浜駅', '横浜'], pref: '神奈川県', region: '関東地方', lat: 35.465800, lng: 139.622300 }
    ,{ name: '大宮駅', answers: ['大宮駅', '大宮'], pref: '埼玉県', region: '関東地方', lat: 35.906300, lng: 139.623700 }
    ,{ name: '千葉駅', answers: ['千葉駅', '千葉'], pref: '千葉県', region: '関東地方', lat: 35.613100, lng: 140.113500 }
    ,{ name: '新潟駅', answers: ['新潟駅', '新潟'], pref: '新潟県', region: '中部地方', lat: 37.912200, lng: 139.061100 }
    ,{ name: '名古屋駅', answers: ['名古屋駅', '名古屋'], pref: '愛知県', region: '中部地方', lat: 35.170900, lng: 136.881500 }
    ,{ name: '静岡駅', answers: ['静岡駅', '静岡'], pref: '静岡県', region: '中部地方', lat: 34.971700, lng: 138.388900 }
    ,{ name: '金沢駅', answers: ['金沢駅', '金沢'], pref: '石川県', region: '中部地方', lat: 36.578100, lng: 136.647500 }
    ,{ name: '京都駅', answers: ['京都駅', '京都'], pref: '京都府', region: '近畿地方', lat: 34.985500, lng: 135.758700 }
    ,{ name: '新大阪駅', answers: ['新大阪駅', '新大阪'], pref: '大阪府', region: '近畿地方', lat: 34.733500, lng: 135.500100 }
    ,{ name: '三ノ宮駅', answers: ['三ノ宮駅', '三宮駅', '三宮'], pref: '兵庫県', region: '近畿地方', lat: 34.694600, lng: 135.195600 }
    ,{ name: '岡山駅', answers: ['岡山駅', '岡山'], pref: '岡山県', region: '中国地方', lat: 34.666900, lng: 133.918900 }
    ,{ name: '広島駅', answers: ['広島駅', '広島'], pref: '広島県', region: '中国地方', lat: 34.397700, lng: 132.475700 }
    ,{ name: '高松駅', answers: ['高松駅', '高松'], pref: '香川県', region: '四国地方', lat: 34.350800, lng: 134.046600 }
    ,{ name: '松山駅', answers: ['松山駅', '松山'], pref: '愛媛県', region: '四国地方', lat: 33.840000, lng: 132.752000 }
    ,{ name: '鹿児島中央駅', answers: ['鹿児島中央駅', '鹿児島中央', '鹿児島'], pref: '鹿児島県', region: '九州・沖縄地方', lat: 31.583900, lng: 130.541700 }
    ,{ name: '那覇空港駅', answers: ['那覇空港駅', '那覇空港'], pref: '沖縄県', region: '九州・沖縄地方', lat: 26.206000, lng: 127.652900 }
    ,{ name: '仙台駅', answers: ['仙台駅', '仙台'], pref: '宮城県', region: '東北地方', lat: 38.260100, lng: 140.882400 }
    ,{ name: '盛岡駅', answers: ['盛岡駅', '盛岡'], pref: '岩手県', region: '東北地方', lat: 39.701500, lng: 141.136600 }
    ,{ name: '新青森駅', answers: ['新青森駅', '新青森', '青森'], pref: '青森県', region: '東北地方', lat: 40.829500, lng: 140.693900 }
    ,{ name: '札幌駅', answers: ['札幌駅', '札幌'], pref: '北海道', region: '北海道地方', lat: 43.068700, lng: 141.350800 }
    ,{ name: '西船橋ジャンクション', answers: ['西船橋ジャンクション', '西船橋JCT', '西船橋'], pref: '千葉県', region: '関東地方', lat: 35.707000, lng: 139.958000 }
    ,{ name: '高谷ジャンクション', answers: ['高谷ジャンクション', '高谷JCT', '高谷'], pref: '千葉県', region: '関東地方', lat: 35.689000, lng: 139.936000 }
    ,{ name: '木更津ジャンクション', answers: ['木更津ジャンクション', '木更津JCT', '木更津'], pref: '千葉県', region: '関東地方', lat: 35.392000, lng: 139.973000 }
    ,{ name: '海老名ジャンクション', answers: ['海老名ジャンクション', '海老名JCT', '海老名'], pref: '神奈川県', region: '関東地方', lat: 35.431000, lng: 139.395000 }
    ,{ name: '御殿場ジャンクション', answers: ['御殿場ジャンクション', '御殿場JCT', '御殿場'], pref: '静岡県', region: '中部地方', lat: 35.303000, lng: 138.922000 }
    ,{ name: '豊田ジャンクション', answers: ['豊田ジャンクション', '豊田JCT', '豊田'], pref: '愛知県', region: '中部地方', lat: 35.050000, lng: 137.176000 }
    ,{ name: '亀山ジャンクション', answers: ['亀山ジャンクション', '亀山JCT', '亀山'], pref: '三重県', region: '近畿地方', lat: 34.867000, lng: 136.423000 }
    ,{ name: '大津ジャンクション', answers: ['大津ジャンクション', '大津JCT', '大津'], pref: '滋賀県', region: '近畿地方', lat: 34.963000, lng: 135.893000 }
    ,{ name: '高槻ジャンクション', answers: ['高槻ジャンクション', '高槻JCT', '高槻'], pref: '大阪府', region: '近畿地方', lat: 34.871000, lng: 135.608000 }
    ,{ name: '門真ジャンクション', answers: ['門真ジャンクション', '門真JCT', '門真'], pref: '大阪府', region: '近畿地方', lat: 34.721000, lng: 135.590000 }
    ,{ name: '神戸ジャンクション', answers: ['神戸ジャンクション', '神戸JCT', '神戸'], pref: '兵庫県', region: '近畿地方', lat: 34.878000, lng: 135.190000 }
    ,{ name: '倉敷ジャンクション', answers: ['倉敷ジャンクション', '倉敷JCT', '倉敷'], pref: '岡山県', region: '中国地方', lat: 34.603000, lng: 133.760000 }
    ,{ name: '福岡ジャンクション', answers: ['福岡ジャンクション', '福岡JCT', '福岡'], pref: '福岡県', region: '九州・沖縄地方', lat: 33.613000, lng: 130.475000 }
    ,{ name: '鳥栖ジャンクション', answers: ['鳥栖ジャンクション', '鳥栖JCT', '鳥栖'], pref: '佐賀県', region: '九州・沖縄地方', lat: 33.390000, lng: 130.490000 }
    ,{ name: '成田国際空港', answers: ['成田国際空港', '成田空港', '成田'], pref: '千葉県', region: '関東地方', lat: 35.772000, lng: 140.392900 }
    ,{ name: '東京国際空港', answers: ['東京国際空港', '羽田空港', '羽田'], pref: '東京都', region: '関東地方', lat: 35.549400, lng: 139.779800 }
    ,{ name: '関西国際空港', answers: ['関西国際空港', '関西空港', '関空'], pref: '大阪府', region: '近畿地方', lat: 34.434700, lng: 135.244000 }
    ,{ name: '中部国際空港', answers: ['中部国際空港', 'セントレア', '中部空港'], pref: '愛知県', region: '中部地方', lat: 34.858400, lng: 136.805000 }
    ,{ name: '新千歳空港', answers: ['新千歳空港', '新千歳', '千歳空港'], pref: '北海道', region: '北海道地方', lat: 42.775200, lng: 141.692300 }
    ,{ name: '福岡空港', answers: ['福岡空港', '福岡'], pref: '福岡県', region: '九州・沖縄地方', lat: 33.585900, lng: 130.450700 }
    ,{ name: '那覇空港', answers: ['那覇空港', '那覇'], pref: '沖縄県', region: '九州・沖縄地方', lat: 26.195800, lng: 127.645900 }
    ,{ name: '仙台空港', answers: ['仙台空港', '仙台'], pref: '宮城県', region: '東北地方', lat: 38.139700, lng: 140.917000 }
    ,{ name: '広島空港', answers: ['広島空港', '広島'], pref: '広島県', region: '中国地方', lat: 34.436100, lng: 132.919000 }
    ,{ name: '熊本空港', answers: ['熊本空港', '熊本'], pref: '熊本県', region: '九州・沖縄地方', lat: 32.837300, lng: 130.855000 }
    ,{ name: '函館空港', answers: ['函館空港', '函館'], pref: '北海道', region: '北海道地方', lat: 41.770000, lng: 140.821900 }
    ,{ name: '旭川空港', answers: ['旭川空港', '旭川'], pref: '北海道', region: '北海道地方', lat: 43.670800, lng: 142.447500 }
    ,{ name: '茨城空港', answers: ['茨城空港', '百里飛行場', '百里基地'], pref: '茨城県', region: '関東地方', lat: 36.181100, lng: 140.415400 }
    ,{ name: '富山空港', answers: ['富山空港', '富山'], pref: '富山県', region: '中部地方', lat: 36.648300, lng: 137.187500 }
    ,{ name: '小松空港', answers: ['小松空港', '小松'], pref: '石川県', region: '中部地方', lat: 36.394600, lng: 136.406700 }
    ,{ name: '岡山空港', answers: ['岡山空港', '岡山'], pref: '岡山県', region: '中国地方', lat: 34.756900, lng: 133.855000 }
    ,{ name: '高松空港', answers: ['高松空港', '高松'], pref: '香川県', region: '四国地方', lat: 34.214200, lng: 134.015600 }
    ,{ name: '松山空港', answers: ['松山空港', '松山'], pref: '愛媛県', region: '四国地方', lat: 33.827200, lng: 132.699700 }
    ,{ name: '鹿児島空港', answers: ['鹿児島空港', '鹿児島'], pref: '鹿児島県', region: '九州・沖縄地方', lat: 31.803400, lng: 130.719400 }
    ,{ name: '宮崎空港', answers: ['宮崎空港', '宮崎'], pref: '宮崎県', region: '九州・沖縄地方', lat: 31.877200, lng: 131.448600 }
];

const WORLD_LOCATIONS = [
    { name: 'Eiffel Tower', answers: ['Eiffel Tower', 'Eiffel'], pref: 'France', region: 'Europe', lat: 48.8584, lng: 2.2945 },
    { name: 'Colosseum', answers: ['Colosseum', 'Coliseum'], pref: 'Italy', region: 'Europe', lat: 41.8902, lng: 12.4922 },
    { name: 'Big Ben', answers: ['Big Ben', 'Elizabeth Tower'], pref: 'United Kingdom', region: 'Europe', lat: 51.5007, lng: -0.1246 },
    { name: 'Sagrada Familia', answers: ['Sagrada Familia', 'Sagrada Família'], pref: 'Spain', region: 'Europe', lat: 41.4036, lng: 2.1744 },
    { name: 'Acropolis of Athens', answers: ['Acropolis', 'Acropolis of Athens'], pref: 'Greece', region: 'Europe', lat: 37.9715, lng: 23.7257 },
    { name: 'Statue of Liberty', answers: ['Statue of Liberty', 'Liberty Statue'], pref: 'United States', region: 'North America', lat: 40.6892, lng: -74.0445 },
    { name: 'Golden Gate Bridge', answers: ['Golden Gate Bridge', 'Golden Gate'], pref: 'United States', region: 'North America', lat: 37.8199, lng: -122.4783 },
    { name: 'Chichen Itza', answers: ['Chichen Itza', 'Chichén Itzá'], pref: 'Mexico', region: 'North America', lat: 20.6843, lng: -88.5678 },
    { name: 'Christ the Redeemer', answers: ['Christ the Redeemer', 'Christ Redeemer'], pref: 'Brazil', region: 'South America', lat: -22.9519, lng: -43.2105 },
    { name: 'Machu Picchu', answers: ['Machu Picchu'], pref: 'Peru', region: 'South America', lat: -13.1631, lng: -72.5450 },
    { name: 'Taj Mahal', answers: ['Taj Mahal'], pref: 'India', region: 'Asia', lat: 27.1751, lng: 78.0421 },
    { name: 'Angkor Wat', answers: ['Angkor Wat', 'Angkor'], pref: 'Cambodia', region: 'Asia', lat: 13.4125, lng: 103.8670 },
    { name: 'Burj Khalifa', answers: ['Burj Khalifa', 'Burj'], pref: 'United Arab Emirates', region: 'Asia', lat: 25.1972, lng: 55.2744 },
    { name: 'Great Wall of China', answers: ['Great Wall of China', 'Great Wall'], pref: 'China', region: 'Asia', lat: 40.4319, lng: 116.5704 },
    { name: 'Petra', answers: ['Petra'], pref: 'Jordan', region: 'Asia', lat: 30.3285, lng: 35.4444 },
    { name: 'Sydney Opera House', answers: ['Sydney Opera House', 'Opera House'], pref: 'Australia', region: 'Oceania', lat: -33.8568, lng: 151.2153 },
    { name: 'Uluru', answers: ['Uluru', 'Ayers Rock'], pref: 'Australia', region: 'Oceania', lat: -25.3444, lng: 131.0369 },
    { name: 'Pyramids of Giza', answers: ['Pyramids of Giza', 'Giza Pyramids', 'Pyramids'], pref: 'Egypt', region: 'Africa', lat: 29.9792, lng: 31.1342 },
    { name: 'Table Mountain', answers: ['Table Mountain'], pref: 'South Africa', region: 'Africa', lat: -33.9628, lng: 18.4098 },
    { name: 'Serengeti National Park', answers: ['Serengeti', 'Serengeti National Park'], pref: 'Tanzania', region: 'Africa', lat: -2.3333, lng: 34.8333 },
    { name: 'Louvre Museum', answers: ['Louvre Museum', 'Louvre'], pref: 'France', region: 'Europe', lat: 48.8606, lng: 2.3376 },
    { name: 'Leaning Tower of Pisa', answers: ['Leaning Tower of Pisa', 'Leaning Tower', 'Tower of Pisa'], pref: 'Italy', region: 'Europe', lat: 43.7230, lng: 10.3966 },
    { name: 'Mount Fuji', answers: ['Mount Fuji', 'Fuji'], pref: 'Japan', region: 'Asia', lat: 35.3606, lng: 138.7274 },
    { name: 'Hagia Sophia', answers: ['Hagia Sophia', 'Ayasofya'], pref: 'Turkey', region: 'Europe', lat: 41.0086, lng: 28.9802 },
    { name: 'Neuschwanstein Castle', answers: ['Neuschwanstein Castle', 'Neuschwanstein'], pref: 'Germany', region: 'Europe', lat: 47.5576, lng: 10.7498 },
    { name: 'Stonehenge', answers: ['Stonehenge'], pref: 'United Kingdom', region: 'Europe', lat: 51.1789, lng: -1.8262 },
    { name: 'Mont Saint-Michel', answers: ['Mont Saint-Michel', 'Mont Saint Michel'], pref: 'France', region: 'Europe', lat: 48.6361, lng: -1.5115 },
    { name: 'Red Square', answers: ['Red Square'], pref: 'Russia', region: 'Europe', lat: 55.7539, lng: 37.6208 },
    { name: 'Niagara Falls', answers: ['Niagara Falls', 'Niagara'], pref: 'Canada', region: 'North America', lat: 43.0962, lng: -79.0377 },
    { name: 'Walt Disney World', answers: ['Walt Disney World', 'Disney World'], pref: 'United States', region: 'North America', lat: 28.3852, lng: -81.5639 },
    { name: 'Yellowstone National Park', answers: ['Yellowstone', 'Yellowstone National Park'], pref: 'United States', region: 'North America', lat: 44.4280, lng: -110.5885 },
    { name: 'Havana Old Town', answers: ['Havana Old Town', 'Old Havana', 'Havana'], pref: 'Cuba', region: 'North America', lat: 23.1366, lng: -82.3531 },
    { name: 'Easter Island Moai', answers: ['Easter Island', 'Moai', 'Easter Island Moai'], pref: 'Chile', region: 'South America', lat: -27.1127, lng: -109.3497 },
    { name: 'Iguazu Falls', answers: ['Iguazu Falls', 'Iguassu Falls', 'Iguazu'], pref: 'Argentina', region: 'South America', lat: -25.6953, lng: -54.4367 },
    { name: 'Bali Temple', answers: ['Bali Temple', 'Bali'], pref: 'Indonesia', region: 'Asia', lat: -8.3405, lng: 115.0920 },
    { name: 'Marina Bay Sands', answers: ['Marina Bay Sands', 'Marina Bay'], pref: 'Singapore', region: 'Asia', lat: 1.2834, lng: 103.8607 },
    { name: 'Borobudur Temple', answers: ['Borobudur', 'Borobudur Temple'], pref: 'Indonesia', region: 'Asia', lat: -7.6079, lng: 110.2038 },
    { name: 'Mount Everest', answers: ['Mount Everest', 'Everest'], pref: 'Nepal', region: 'Asia', lat: 27.9881, lng: 86.9250 },
    { name: 'Terracotta Army', answers: ['Terracotta Army', 'Terracotta Warriors'], pref: 'China', region: 'Asia', lat: 34.3841, lng: 109.2785 },
    { name: 'Kinkaku-ji', answers: ['Kinkaku-ji', 'Golden Pavilion', 'Kinkakuji'], pref: 'Japan', region: 'Asia', lat: 35.0394, lng: 135.7292 },
    { name: 'Lalibela Churches', answers: ['Lalibela', 'Lalibela Churches'], pref: 'Ethiopia', region: 'Africa', lat: 12.0317, lng: 39.0473 },
    { name: 'Victoria Falls', answers: ['Victoria Falls'], pref: 'Zimbabwe', region: 'Africa', lat: -17.9243, lng: 25.8572 },
    { name: 'Sphinx of Giza', answers: ['Sphinx', 'Great Sphinx', 'Sphinx of Giza'], pref: 'Egypt', region: 'Africa', lat: 29.9753, lng: 31.1376 },
    { name: 'Marrakesh Medina', answers: ['Marrakesh Medina', 'Marrakesh', 'Marrakech'], pref: 'Morocco', region: 'Africa', lat: 31.6258, lng: -7.9892 },
    { name: 'Avenue of Baobabs', answers: ['Avenue of Baobabs', 'Baobab Avenue'], pref: 'Madagascar', region: 'Africa', lat: -20.2500, lng: 44.4183 },
    { name: 'Milford Sound', answers: ['Milford Sound'], pref: 'New Zealand', region: 'Oceania', lat: -44.6719, lng: 167.9250 },
    { name: 'Great Barrier Reef', answers: ['Great Barrier Reef', 'Barrier Reef'], pref: 'Australia', region: 'Oceania', lat: -18.2871, lng: 147.6992 },
    { name: 'Bora Bora', answers: ['Bora Bora'], pref: 'French Polynesia', region: 'Oceania', lat: -16.5004, lng: -151.7415 }
];

const JAPAN_CENTER = [36.5, 138.0];
const JAPAN_DEFAULT_ZOOM = 5;
const WORLD_CENTER = [20, 10];
const WORLD_DEFAULT_ZOOM = 2;
const EASY_LOCATION_NAMES = new Set([
    '東京駅', '大阪城', '清水寺', '札幌時計台', '博多駅', '首里城跡', '原爆ドーム',
    '名古屋城', '兼六園', '松本城', '鎌倉大仏', '東大寺', '熊本城', '弘前城', '錦帯橋',
    '鳥取砂丘', '浅草寺', '東京タワー', '東京スカイツリー', '明治神宮', '皇居',
    '横浜ランドマークタワー', '日光東照宮', '熱田神宮', '犬山城', '富士山五合目',
    '彦根城', '平等院', '金閣寺',
    '伏見稲荷大社', '通天閣', '海遊館', '姫路城', '法隆寺', '出雲大社', '松江城',
    '宮島厳島神社', '広島城', '鳴門の渦潮', '道後温泉', '松山城', '高知城', '太宰府天満宮',
    'ハウステンボス', '阿蘇山', '高千穂峡', '桜島', '美ら海水族館', '五稜郭', '小樽運河',
    '松島', '新宿駅', '品川駅', '上野駅', '横浜駅', '大宮駅', '名古屋駅', '金沢駅',
    '京都駅', '新大阪駅', '岡山駅', '広島駅', '仙台駅', '札幌駅',
    '高山古い町並', '浜名湖', '上高地', '有馬温泉', '秋芳洞', '三保松原'
]);

const UNSUITABLE_LOCATION_NAMES = new Set([
    '本願寺御影堂', '原爆ドーム世界遺産', '立石寺',
    '山寺立石寺', '錦帯橋公園', '大阪城公園', '熊本城公園'
]);
const PREFECTURES = [
  '北海道',
  '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県',
  '沖縄県',
];
const PREFECTURE_GROUPS = [
        { label: ['Hokkaido', '北海道'], prefectures: ['北海道'] },
        { label: ['Tohoku', '東北地方'], prefectures: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'] },
        { label: ['Kanto', '関東地方'], prefectures: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'] },
        { label: ['Chubu', '中部地方'], prefectures: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'] },
        { label: ['Kinki', '近畿地方'], prefectures: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'] },
        { label: ['Chugoku', '中国地方'], prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県'] },
        { label: ['Shikoku', '四国地方'], prefectures: ['徳島県', '香川県', '愛媛県', '高知県'] },
        { label: ['Kyushu / Okinawa', '九州・沖縄地方'], prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'] }
];
const COUNTRIES = [...new Set(WORLD_LOCATIONS.map((location) => location.pref))];
const WORLD_COUNTRY_GROUPS = [
    { key: 'Europe', label: ['Europe', 'ヨーロッパ'] },
    { key: 'North America', label: ['North America', '北アメリカ'] },
    { key: 'South America', label: ['South America', '南アメリカ'] },
    { key: 'Asia', label: ['Asia', 'アジア'] },
    { key: 'Africa', label: ['Africa', 'アフリカ'] },
    { key: 'Oceania', label: ['Oceania', 'オセアニア'] }
];
const WORLD_JAPANESE_COUNTRIES = {
    France: 'フランス', Italy: 'イタリア', 'United Kingdom': 'イギリス', Spain: 'スペイン', Greece: 'ギリシャ',
    'United States': 'アメリカ合衆国', Mexico: 'メキシコ', Brazil: 'ブラジル', Peru: 'ペルー', India: 'インド',
    Cambodia: 'カンボジア', 'United Arab Emirates': 'アラブ首長国連邦', China: '中国', Jordan: 'ヨルダン',
    Australia: 'オーストラリア', Egypt: 'エジプト', 'South Africa': '南アフリカ', Tanzania: 'タンザニア',
    Japan: '日本', Turkey: 'トルコ', Germany: 'ドイツ', Russia: 'ロシア', Canada: 'カナダ', Cuba: 'キューバ',
    Chile: 'チリ', Argentina: 'アルゼンチン', Indonesia: 'インドネシア', Singapore: 'シンガポール', Nepal: 'ネパール',
    Ethiopia: 'エチオピア', Zimbabwe: 'ジンバブエ', Morocco: 'モロッコ', Madagascar: 'マダガスカル',
    'New Zealand': 'ニュージーランド', 'French Polynesia': 'フランス領ポリネシア'
};
const WORLD_JAPANESE_NAMES = {
    'Eiffel Tower': 'エッフェル塔', Colosseum: 'コロッセオ', 'Big Ben': 'ビッグ・ベン', 'Sagrada Familia': 'サグラダ・ファミリア',
    'Acropolis of Athens': 'アテネのアクロポリス', 'Statue of Liberty': '自由の女神', 'Golden Gate Bridge': 'ゴールデンゲートブリッジ',
    'Chichen Itza': 'チチェン・イッツァ', 'Christ the Redeemer': 'コルコバードのキリスト像', 'Machu Picchu': 'マチュピチュ',
    'Taj Mahal': 'タージ・マハル', 'Angkor Wat': 'アンコール・ワット', 'Burj Khalifa': 'ブルジュ・ハリファ',
    'Great Wall of China': '万里の長城', Petra: 'ペトラ遺跡', 'Sydney Opera House': 'シドニー・オペラハウス',
    Uluru: 'ウルル', 'Pyramids of Giza': 'ギザのピラミッド', 'Table Mountain': 'テーブルマウンテン',
    'Serengeti National Park': 'セレンゲティ国立公園', 'Louvre Museum': 'ルーヴル美術館', 'Leaning Tower of Pisa': 'ピサの斜塔',
    'Mount Fuji': '富士山', 'Hagia Sophia': 'アヤソフィア', 'Neuschwanstein Castle': 'ノイシュヴァンシュタイン城',
    Stonehenge: 'ストーンヘンジ', 'Mont Saint-Michel': 'モン・サン＝ミシェル', 'Red Square': '赤の広場',
    'Niagara Falls': 'ナイアガラの滝', 'Walt Disney World': 'ウォルト・ディズニー・ワールド',
    'Yellowstone National Park': 'イエローストーン国立公園', 'Havana Old Town': 'ハバナ旧市街',
    'Easter Island Moai': 'イースター島のモアイ像', 'Iguazu Falls': 'イグアスの滝', 'Bali Temple': 'バリ島の寺院',
    'Marina Bay Sands': 'マリーナ・ベイ・サンズ', 'Borobudur Temple': 'ボロブドゥール寺院', 'Mount Everest': 'エベレスト',
    'Terracotta Army': '兵馬俑', 'Kinkaku-ji': '金閣寺', 'Lalibela Churches': 'ラリベラの岩窟教会群',
    'Victoria Falls': 'ビクトリアの滝', 'Sphinx of Giza': 'ギザの大スフィンクス', 'Marrakesh Medina': 'マラケシュ旧市街',
    'Avenue of Baobabs': 'バオバブ街道', 'Milford Sound': 'ミルフォード・サウンド',
    'Great Barrier Reef': 'グレート・バリア・リーフ', 'Bora Bora': 'ボラボラ島'
};

function displayLocationName(location) {
    return state.language === 'ja' && state.gameType === 'world'
        ? WORLD_JAPANESE_NAMES[location.name] || location.name
        : location.name;
}

function displayCountryName(country) {
    return state.language === 'ja' && state.gameType === 'world'
        ? WORLD_JAPANESE_COUNTRIES[country] || country
        : country;
}


/* ================================================================
   2. Leaflet読み込み（HTML側にscriptタグが無いためJSで動的取得）
   ================================================================ */

function loadLeaflet() {
    return new Promise((resolve, reject) => {
        if (window.L) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Leafletの読み込みに失敗しました'));
        document.head.appendChild(script);
    });
}


/* ================================================================
   3. アプリ状態
   ================================================================ */

const state = {
    settings: {
        questionCount: 10,
        timeLimit: 120,
        animations: true,
        sound: true
    },

    language: localStorage.getItem('jlg-language') || 'en',
    gameType: 'japan',
    homeGameMode: 'challenge',

    session: null,   // 進行中〜終了後のゲームセッション
    round: null,     // 現在のラウンド情報

    timerId: null,

    proposals: [],
    friends: [],
    mapSuggestions: [],
    placeSuggestions: [],

    photoMap: null,
    photoTileLayer: null,
    answerMap: null,
    answerMarker: null,
    resultMap: null,

    activeModal: null
};

const el = {};


/* ================================================================
   4. 初期化
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    populatePrefectureOptions();
    loadSettings();
    loadProposals();
    loadSuggestionLists();
    bindEvents();
    setLanguage(state.language);
    el.gameInfo.after(el.hintPanel);
    showScreen('home');

    loadLeaflet()
        .then(() => {
            return undefined;
        })
        .catch(() => {
            showNotification(languageText('Could not load the map library. Please check your connection.', '地図を読み込めませんでした。接続を確認してください。'), 'error');
        });
});

function cacheElements() {
    const ids = [
        'menu-button', 'logo', 'side-menu', 'close-menu-button', 'menu-overlay',
        'menu-home', 'menu-practice', 'menu-friends', 'menu-new-map', 'menu-new-place',
        'question-number', 'question-total', 'score-value', 'timer-value', 'header-timer', 'language-select',

        'game-screen', 'game-info', 'hint-panel', 'result-screen', 'home-screen', 'proposals-screen', 'settings-screen', 'help-screen',
        'friends-screen', 'new-map-screen', 'new-place-screen',
        'game-mode-label', 'game-title', 'round-value',

        'photo-fullscreen-button', 'photo-container', 'photo-placeholder', 'location-photo',
        'photo-loading', 'photo-error', 'photo-source-label', 'photo-question-hint',
        'photo-caption', 'photo-meta-resolution', 'photo-meta-type',

        'map-status', 'prefecture-input', 'answer-input',

        'submit-answer-button', 'skip-answer-button',
        'hint-text', 'hint-button', 'keyboard-help',

        'result-title', 'result-score', 'result-correct', 'result-average-distance', 'result-best-score', 'result-time',
        'result-items', 'play-again-button', 'back-home-button',
        'share-result-button', 'share-result-text',

        'start-challenge-button', 'start-practice-button',

        'proposal-form', 'proposal-name', 'proposal-prefecture', 'proposal-answer',
        'proposal-latitude', 'proposal-longitude', 'proposal-grid', 'proposal-count',
        'friend-form', 'friend-name', 'friend-list', 'new-map-form', 'new-map-name', 'new-map-description', 'new-map-list',
        'new-place-form', 'new-place-name', 'new-place-region', 'new-place-list',

        'question-count-setting', 'time-limit-setting', 'animation-setting', 'sound-setting', 'save-settings-button',

        'footer-help-button', 'footer-settings-button',

        'answer-result-modal', 'close-result-modal-button', 'result-status-label', 'answer-score',
        'correct-location-name', 'answer-distance', 'player-location-name',
        'result-map', 'next-question-button',

        'hint-modal', 'close-hint-modal-button', 'hint-modal-text', 'close-hint-button',

        'quit-modal', 'cancel-quit-button', 'confirm-quit-button',

        'notification-container'
    ];

    ids.forEach((id) => {
        el[toCamelCase(id)] = document.getElementById(id);
    });
}

function populatePrefectureOptions() {
    [el.proposalPrefecture].forEach((select) => {
        PREFECTURES.forEach((prefecture) => {
            const option = document.createElement('option');
            option.value = prefecture;
            option.textContent = prefecture;
            select.appendChild(option);
        });
    });
    updateLocationOptions();
}

function updateLocationOptions() {
    const label = state.gameType === 'world'
        ? languageText('Select country', '国を選択')
        : languageText('Select prefecture', '都道府県を選択');
    el.prefectureInput.setAttribute('aria-label', label);
    el.prefectureInput.innerHTML = `<option value="">${label}</option>`;

    if (state.gameType === 'world') {
        WORLD_COUNTRY_GROUPS.forEach((group) => {
            const groupCountries = [...new Set(
                WORLD_LOCATIONS
                    .filter((location) => location.region === group.key)
                    .map((location) => location.pref)
            )].sort((first, second) => displayCountryName(first).localeCompare(displayCountryName(second), state.language));
            if (!groupCountries.length) return;

            const optgroup = document.createElement('optgroup');
            optgroup.label = languageText(...group.label);
            groupCountries.forEach((optionValue) => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = displayCountryName(optionValue);
                optgroup.appendChild(option);
            });
            el.prefectureInput.appendChild(optgroup);
        });
        return;
    }

    PREFECTURE_GROUPS.forEach((group) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = languageText(...group.label);
        group.prefectures.forEach((optionValue) => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            optgroup.appendChild(option);
        });
        el.prefectureInput.appendChild(optgroup);
    });
}

function toCamelCase(id) {
    return id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

const UI_TRANSLATIONS = {
    en: {
        '#menu-button': 'Open menu', '#close-menu-button': 'Close menu', '#menu-home': 'Home',
        '#menu-practice': 'Practice mode',
        '#menu-japan': 'Japan', '#menu-world': 'World', '#menu-results': 'Results', '#menu-proposals': 'Community questions', '#menu-settings': 'Settings',
        '#menu-practice-japan': 'Japan', '#menu-practice-world': 'World', '.menu-section-label': 'Practice mode',
        '#start-challenge-button .mode-card-title': 'JAPAN', '#start-practice-button .mode-card-title': 'WORLD',
        '#start-challenge-button .mode-card-description': 'Guess locations across Japan.',
        '#start-practice-button .mode-card-description': 'Guess countries and places around the world.',
        '#menu-help': 'How to play', '#game-title': 'Where in Japan is this?',
        '#game-screen': 'Game screen', '#game-progress': 'Game progress', '#header-score': 'Current score',
        '#header-timer': 'Time remaining', '.language-select-label .sr-only': 'Language', '#language-select': 'Language',
        '#game-mode-label': 'JAPAN LOCATION', '#photo-panel .panel-kicker': 'LOCATION', '#map-panel .panel-kicker': 'ANSWER',
        '#photo-fullscreen-button': 'Enlarge satellite image', '#photo-panel .placeholder-title': 'Loading satellite image',
        '#photo-panel .placeholder-description': 'Please wait while the image loads.', '#photo-loading span:last-child': 'Loading...',
        '#photo-error strong': 'Could not load the image', '#photo-error p': 'Please check the image file.',
        '#photo-source-label': 'SATELLITE VIEW', '#photo-caption': 'Guess the location from the image.', '#photo-meta-type': 'Aerial',
        '#map-status': 'Text entry', '#prefecture-input': 'Select prefecture',
        '#keyboard-help span:nth-child(1)': 'Enter answer', '#keyboard-help span:nth-child(2)': 'Submit', '#keyboard-help span:nth-child(3)': 'Hint',
        '.home-hero h1': 'Find the place in Japan.', '.home-hero p': 'Use satellite imagery as your clue and figure out where you are.',
        '#photo-panel h2': 'Find this place', '#map-panel h2': 'Enter your answer',
        '.answer-entry-label': 'Select a prefecture and enter the place.',
        '#answer-input-help': 'Enter the landmark or place name shown in the image.',
        '.answer-instruction strong': 'Enter your answer', '.answer-instruction p': 'Enter the name of the place to submit your answer.',
        '#submit-answer-button': 'Submit answer', '#skip-answer-button': 'Skip', '#hint-button': 'Hint',
        '#result-title': 'Game results', '.result-header p': 'Here are your results.', '.result-header .panel-kicker': 'RESULT',
        '.result-main-score .small-label': 'SCORE', '.result-main-score span:last-child': 'POINTS',
        '.result-stat:nth-child(1) span': 'Correct answers', '.result-stat:nth-child(2) span': 'Average distance',
        '.result-stat:nth-child(3) span': 'Best question score', '.result-stat:nth-child(4) span': 'Time used',
        '#play-again-button': 'Play again', '#result-screen .result-list-header h2': 'Question breakdown',
        '#back-home-button': 'Back to home', '#share-result-text': 'Share score',
        '#proposals-screen h1': 'Community questions', '#proposals-screen > div > div > p': 'Suggest a place and add it to the game.',
        '#proposal-form h2': 'Suggest a new question', '#proposal-form button': 'Add question',
        '#settings-screen h1': 'Settings', '#help-screen h1': 'How to play', '#footer-help-button': 'How to play',
        '#footer-settings-button': 'Settings', '#proposals-screen .panel-kicker': 'COMMUNITY QUESTIONS',
        '#settings-screen .panel-kicker': 'SETTINGS', '#help-screen .panel-kicker': 'HOW TO PLAY',
        '#home-screen .hero-kicker': 'JAPAN LOCATION GAME', '#answer-result-title': 'Answer result',
        '#close-result-modal-button': 'Close', '#next-question-button': 'Next question', '#hint-title': 'Hint',
        '#close-hint-modal-button': 'Close', '#close-hint-button': 'Close', '#quit-title': 'Quit the game?',
        '#cancel-quit-button': 'Cancel', '#confirm-quit-button': 'Quit',
        '.information-card:nth-child(1) strong': 'Score big for correct answers', '.information-card:nth-child(1) p': 'Match both the prefecture and place name to score.',
        '.information-card:nth-child(2) strong': 'Race the clock', '.information-card:nth-child(2) p': 'Answer as accurately as possible before time runs out.',
        '.information-card:nth-child(3) strong': 'Study the landscape', '.information-card:nth-child(3) p': 'Roads, mountains, rivers, and cities are useful clues.',
        '#proposal-form h2': 'Suggest a new question', '#proposal-form .proposal-form-heading span': 'Saved on this device',
        '#proposal-form label:nth-child(1)': 'Place name', '#proposal-form label:nth-child(2)': 'Prefecture', '#proposal-form label:nth-child(3)': 'Accepted answer(s)',
        '#proposal-form label:nth-child(4)': 'Latitude', '#proposal-form label:nth-child(5)': 'Longitude', '.proposal-list-heading h2': 'Suggested questions',
        '#settings-screen .settings-section:nth-of-type(1) h2': 'Game', '#settings-screen .settings-section:nth-of-type(2) h2': 'Display',
        '#save-settings-button': 'Save settings', '#hint-modal .result-status-label': 'HINT', '#quit-modal .result-status-label': 'CONFIRM',
        '#quit-modal .modal-header p': 'Your current progress will be lost.', '#answer-result-modal .answer-result-score span:first-child': 'Score for this answer',
        '#answer-result-modal .answer-result-score span:last-child': 'POINTS', '#answer-result-modal .answer-result-item:nth-child(1) span': 'Correct location',
        '#answer-result-modal .answer-result-item:nth-child(2) span': 'Distance to correct location', '#answer-result-modal .answer-result-item:nth-child(3) span': 'Your answer',
        '#hint-modal-text': 'Your hint will appear here.',
        '.setting-row:nth-child(1) strong': 'Question count', '.setting-row:nth-child(1) p': 'Number of questions per game.',
        '.setting-row:nth-child(2) strong': 'Time limit', '.setting-row:nth-child(2) p': 'Time allowed for each question.',
        '.setting-row:nth-child(3) strong': 'Animations', '.setting-row:nth-child(3) p': 'Use interface animations.',
        '.setting-row:nth-child(4) strong': 'Sound effects', '.setting-row:nth-child(4) p': 'Use sound effects during the game.',
        '.help-step:nth-child(1) h2': 'Study the image', '.help-step:nth-child(1) p': 'Study the satellite image carefully. Use mountains, rivers, roads, buildings, and fields as clues.',
        '.help-step:nth-child(2) h2': 'Guess the place', '.help-step:nth-child(2) p': 'Select a prefecture and enter the place name you think is shown.',
        '.help-step:nth-child(3) h2': 'Submit your answer', '.help-step:nth-child(3) p': 'Press “Submit answer” to reveal your answer and the solution.',
        '.help-step:nth-child(4) h2': 'Earn your score', '.help-step:nth-child(4) p': 'Get a high score by matching both the prefecture and place name.',
        '.help-scoring h2': 'Scoring', '.scoring-header span:first-child': 'Answer', '.scoring-header span:last-child': 'Score',
        '.scoring-row:nth-child(2) span': 'Correct prefecture and place', '.scoring-row:nth-child(3) span': 'Place name only',
        '.scoring-row:nth-child(4) span': 'Prefecture only', '.scoring-row:nth-child(5) span': 'Aliases and short names', '.scoring-row:nth-child(6) span': 'Time out or no answer'
    },
    ja: {
        '#menu-button': 'メニューを開く', '#close-menu-button': 'メニューを閉じる', '#menu-home': 'ホーム',
        '#menu-practice': '練習モード',
        '#menu-japan': '日本', '#menu-world': '世界', '#menu-results': '結果', '#menu-proposals': 'みんなの問題', '#menu-settings': '設定', '#menu-help': '遊び方',
        '#menu-practice-japan': '日本', '#menu-practice-world': 'ワールド', '.menu-section-label': '練習モード',
        '#start-challenge-button .mode-card-title': '日本', '#start-practice-button .mode-card-title': 'ワールド',
        '#start-challenge-button .mode-card-description': '日本各地の場所を当てよう。',
        '#start-practice-button .mode-card-description': '世界の国と場所を当てよう。',
        '#game-title': 'この場所は日本のどこ？', '#game-screen': 'ゲーム画面', '#game-progress': 'ゲームの進捗', '#header-score': '現在のスコア',
        '#header-timer': '残り時間', '.language-select-label .sr-only': '言語', '#language-select': '言語', '#game-mode-label': '日本の場所',
        '#photo-panel h2': 'この場所を見つけよう', '#map-panel h2': '答えを入力', '#photo-panel .panel-kicker': '場所', '#map-panel .panel-kicker': '回答',
        '#photo-fullscreen-button': '衛星画像を拡大', '#photo-panel .placeholder-title': '衛星画像を読み込み中',
        '#photo-panel .placeholder-description': '画像の読み込みをお待ちください。', '#photo-loading span:last-child': '読み込み中...',
        '#photo-error strong': '画像を読み込めませんでした', '#photo-error p': '画像ファイルを確認してください。',
        '#photo-source-label': '衛星画像', '#photo-caption': '画像から場所を推理してください。', '#photo-meta-type': '航空写真',
        '#map-status': '文字入力', '#prefecture-input': '都道府県を選択',
        '.home-hero h1': '日本のどこかを\n見つけよう。', '.home-hero p': '航空写真を手がかりにして、日本のどこなのかを推理してください。',
        '.answer-entry-label': '都道府県と場所を選んでください', '#answer-input-help': '写真から分かる施設名や場所名を入力してください。',
        '.answer-instruction strong': '答えを入力', '.answer-instruction p': '場所の名前を入力して回答してください。',
        '#submit-answer-button': '回答する', '#skip-answer-button': 'スキップ', '#hint-button': 'ヒント',
        '#result-title': 'ゲーム結果', '.result-header p': '今回の回答結果です。', '.result-header .panel-kicker': '結果',
        '.result-main-score .small-label': 'スコア', '.result-main-score span:last-child': 'ポイント',
        '.result-stat:nth-child(1) span': '正解数', '.result-stat:nth-child(2) span': '平均距離',
        '.result-stat:nth-child(3) span': '最高得点', '.result-stat:nth-child(4) span': '経過時間',
        '#play-again-button': 'もう一度遊ぶ', '#result-screen .result-list-header h2': '問題ごとの結果', '#back-home-button': 'ホームへ戻る',
        '#share-result-text': 'スコアを共有', '#proposals-screen h1': 'みんなの問題',
        '#proposals-screen > div > div > p': '知っている場所を提案して、次の問題に加えましょう。',
        '#proposal-form h2': '新しい問題を提案', '#proposal-form button': '問題を追加',
        '#settings-screen h1': '設定', '#help-screen h1': '遊び方', '#footer-help-button': '遊び方', '#footer-settings-button': '設定',
        '#proposals-screen .panel-kicker': 'みんなの問題', '#settings-screen .panel-kicker': '設定', '#help-screen .panel-kicker': '遊び方',
        '#home-screen .hero-kicker': '日本の場所ゲーム', '#answer-result-title': '回答結果', '#close-result-modal-button': '閉じる',
        '#next-question-button': '次の問題', '#hint-title': 'ヒント', '#close-hint-modal-button': '閉じる', '#close-hint-button': '閉じる',
        '#quit-title': 'ゲームを終了しますか？', '#cancel-quit-button': 'キャンセル', '#confirm-quit-button': '終了',
        '.information-card:nth-child(1) strong': '正解して高得点を狙おう', '.information-card:nth-child(1) p': '都道府県と場所名の両方が合うと得点になります。',
        '.information-card:nth-child(2) strong': '時間内に答えよう', '.information-card:nth-child(2) p': '時間切れになる前に、できるだけ正確に答えてください。',
        '.information-card:nth-child(3) strong': '景色を観察しよう', '.information-card:nth-child(3) p': '道路、山、川、街並みが手がかりになります。',
        '#proposal-form h2': '新しい問題を提案', '#proposal-form .proposal-form-heading span': 'この端末に保存',
        '#proposal-form label:nth-child(1)': '場所名', '#proposal-form label:nth-child(2)': '都道府県', '#proposal-form label:nth-child(3)': '正解候補',
        '#proposal-form label:nth-child(4)': '緯度', '#proposal-form label:nth-child(5)': '経度', '.proposal-list-heading h2': '提案された問題',
        '#settings-screen .settings-section:nth-of-type(1) h2': 'ゲーム', '#settings-screen .settings-section:nth-of-type(2) h2': '表示',
        '#save-settings-button': '設定を保存', '#hint-modal .result-status-label': 'ヒント', '#quit-modal .result-status-label': '確認',
        '#quit-modal .modal-header p': '現在の進行状況は失われます。', '#answer-result-modal .answer-result-score span:first-child': 'この回答のスコア',
        '#answer-result-modal .answer-result-score span:last-child': 'ポイント', '#answer-result-modal .answer-result-item:nth-child(1) span': '正解の場所',
        '#answer-result-modal .answer-result-item:nth-child(2) span': '正解地点までの距離', '#answer-result-modal .answer-result-item:nth-child(3) span': 'あなたの回答'
        , '#hint-modal-text': 'ヒントがここに表示されます。',
        '.setting-row:nth-child(1) strong': '問題数', '.setting-row:nth-child(1) p': '1ゲームあたりの問題数。',
        '.setting-row:nth-child(2) strong': '制限時間', '.setting-row:nth-child(2) p': '1問あたりの制限時間。',
        '.setting-row:nth-child(3) strong': 'アニメーション', '.setting-row:nth-child(3) p': '画面のアニメーションを使用します。',
        '.setting-row:nth-child(4) strong': '効果音', '.setting-row:nth-child(4) p': 'ゲーム中に効果音を使用します。',
        '.help-step:nth-child(1) h2': '画像を観察', '.help-step:nth-child(1) p': '衛星画像をよく観察し、山、川、道路、建物、畑などを手がかりにしてください。',
        '.help-step:nth-child(2) h2': '場所を推理', '.help-step:nth-child(2) p': '都道府県を選び、写っていると思う場所名を入力してください。',
        '.help-step:nth-child(3) h2': '答えを送信', '.help-step:nth-child(3) p': '「回答する」を押すと、あなたの答えと正解が表示されます。',
        '.help-step:nth-child(4) h2': 'スコアを獲得', '.help-step:nth-child(4) p': '都道府県と場所名の両方を当てて高得点を目指しましょう。',
        '.help-scoring h2': '採点', '.scoring-header span:first-child': '回答', '.scoring-header span:last-child': 'スコア',
        '.scoring-row:nth-child(2) span': '都道府県と場所名が正解', '.scoring-row:nth-child(3) span': '場所名のみ',
        '.scoring-row:nth-child(4) span': '都道府県のみ', '.scoring-row:nth-child(5) span': '登録済みの別名・略称', '.scoring-row:nth-child(6) span': '時間切れ・未回答'
    }
};

function setLanguage(language) {
    state.language = language === 'ja' ? 'ja' : 'en';
    localStorage.setItem('jlg-language', state.language);
    document.documentElement.lang = state.language;
    document.title = languageText("Where's this?", '日本どこでしょう？');
    el.languageSelect.value = state.language;

    Object.entries(UI_TRANSLATIONS[state.language]).forEach(([selector, text]) => {
        document.querySelectorAll(selector).forEach((element) => {
            if (element.id === 'menu-button') {
                element.setAttribute('aria-label', text);
            } else if (element.id === 'close-menu-button') {
                element.setAttribute('aria-label', text);
            } else if (['game-screen', 'game-progress', 'header-score', 'header-timer'].includes(element.id)) {
                element.setAttribute('aria-label', text);
            } else if (element.tagName === 'SELECT') {
                element.setAttribute('aria-label', text);
            } else if (element.tagName === 'LABEL') {
                const textNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                if (textNode) textNode.textContent = `\n                                ${text}\n                                `;
            } else if (element.classList.contains('menu-item')) {
                element.querySelector('span:last-child').textContent = text;
            } else if (element.classList.contains('location-choice')) {
                element.querySelector('span:last-child').textContent = text;
            } else if (element.id === 'submit-answer-button') {
                element.querySelector('span').textContent = text;
            } else if (element.matches('button')) {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        });
    });
    document.querySelector('.logo-main').textContent = languageText("Where's this?", 'Where\'s this?');
    document.querySelector('.logo-sub').textContent = languageText('GUESS JAPAN', '日本を見つけよう');
    document.querySelectorAll('.header-stat-label').forEach((element, index) => {
        element.textContent = languageText(index === 0 ? 'SCORE' : 'TIME', index === 0 ? 'スコア' : '時間');
    });
    const commonText = state.language === 'ja'
        ? {
            '.side-menu-header h2': 'メニュー', '.side-menu-footer p:first-child': 'Where\'s this?',
            '.side-menu-footer .version': 'バージョン 1.0', '.result-list-header h2': '各問題の結果',
            '#game-screen .hint-content p': '写真に写っている地形、道路、建物、植生などをよく観察してください。'
        }
        : {
            '.side-menu-header h2': 'Menu', '.side-menu-footer p:first-child': 'Guess the Location Game',
            '.side-menu-footer .version': 'Version 1.0', '.result-list-header h2': 'Question breakdown',
            '#game-screen .hint-content p': 'Look closely at the terrain, roads, buildings, and vegetation.'
        };
    Object.entries(commonText).forEach(([selector, text]) => {
        document.querySelectorAll(selector).forEach((element) => { element.textContent = text; });
    });
    const formText = state.language === 'ja'
        ? {
            '#answer-input': state.gameType === 'world' ? '場所名を入力（例：エッフェル塔）' : '場所名を入力（例：東京駅）', '#proposal-name': '例：犬山城',
            '#proposal-answer': '例：犬山城、犬山', '#proposal-prefecture': '都道府県を選択',
            '#proposal-name + input': '例：犬山城', '#prefecture-input': '都道府県を選択'
        }
        : {
            '#answer-input': state.gameType === 'world' ? 'Enter a place name (e.g. Eiffel Tower)' : 'Enter a place name (e.g. Tokyo Station)', '#proposal-name': 'e.g. Inuyama Castle',
            '#proposal-answer': 'e.g. Inuyama Castle, Inuyama', '#proposal-prefecture': 'Select a prefecture',
            '#prefecture-input': 'Select prefecture'
        };
    Object.entries(formText).forEach(([selector, text]) => {
        document.querySelectorAll(selector).forEach((element) => {
            if (element.tagName === 'INPUT') element.placeholder = text;
            if (element.tagName === 'SELECT' && element.options[0]) element.options[0].textContent = text;
        });
    });
    updateSettingOptions();
    updateLocationOptions();
    updateModeUI();
    if (state.round) updateHintText(state.round.target);
    renderProposals();
}

function updateSettingOptions() {
    const questionLabels = state.language === 'ja' ? ['5問', '10問', '20問', '30問'] : ['5 questions', '10 questions', '20 questions', '30 questions'];
    const timeLabels = state.language === 'ja' ? ['30秒', '60秒', '120秒', '無制限'] : ['30 seconds', '60 seconds', '120 seconds', 'Unlimited'];
    Array.from(el.questionCountSetting.options).forEach((option, index) => { option.textContent = questionLabels[index]; });
    Array.from(el.timeLimitSetting.options).forEach((option, index) => { option.textContent = timeLabels[index]; });
}

function languageText(english, japanese) {
    return state.language === 'ja' ? japanese : english;
}

function updateModeUI() {
    const isWorld = state.gameType === 'world';
    const modeText = isWorld
        ? ['WORLD LOCATION', '世界の場所']
        : ['JAPAN LOCATION', '日本の場所'];
    const titleText = isWorld
        ? ['Where in the world is this?', 'この場所は世界のどこ？']
        : ['Where in Japan is this?', 'この場所は日本のどこ？'];
    const heroText = isWorld
        ? ['Find the place\nin the world.', '世界のどこかを\n見つけよう。']
        : ['Find the place\nin Japan.', '日本のどこかを\n見つけよう。'];
    const sessionMode = state.session?.mode || state.homeGameMode;
    const modeLabel = sessionMode === 'practice'
        ? ['PRACTICE MODE', '練習モード']
        : ['NORMAL MODE', '通常モード'];
    el.gameModeLabel.textContent = `${languageText(...modeLabel)} · ${languageText(...modeText)}`;
    el.gameTitle.textContent = languageText(...titleText);
    document.querySelector('.home-hero .hero-kicker').textContent = languageText(
        isWorld ? 'WORLD LOCATION GAME' : 'JAPAN LOCATION GAME',
        isWorld ? '世界の場所ゲーム' : '日本の場所ゲーム'
    );
    document.querySelector('.home-hero h1').textContent = languageText(...heroText);
    document.querySelector('.home-hero p').textContent = languageText(
        isWorld ? 'Use satellite imagery as your clue and figure out which country and place you are seeing.' : 'Use satellite imagery as your clue and figure out where you are.',
        isWorld ? '航空写真を手がかりに、どの国のどの場所なのかを推理してください。' : '航空写真を手がかりに、日本のどこなのかを推理してください。'
    );
    document.querySelector('.side-menu-footer p:first-child').textContent = languageText(
        isWorld ? 'World Location Game' : 'Japan Location Game',
        isWorld ? '世界の場所ゲーム' : '日本どこでしょう？'
    );
    document.querySelector('#site-footer .footer-left span:last-child').textContent = languageText(
        isWorld ? 'World Location Game' : 'Japan Location Game',
        isWorld ? '世界の場所ゲーム' : '日本どこでしょう？'
    );
    const entryLabel = document.querySelector('.answer-entry-label');
    entryLabel.textContent = languageText(
        isWorld ? 'Select a country and enter the place.' : 'Select a prefecture and enter the place.',
        isWorld ? '国を選び、場所名を入力してください。' : '都道府県と場所を選んでください。'
    );
    el.answerInput.placeholder = languageText(
        isWorld ? 'Enter a place name (e.g. Eiffel Tower)' : 'Enter a place name (e.g. Tokyo Station)',
        isWorld ? '場所名を入力（例：エッフェル塔）' : '場所名を入力（例：東京駅）'
    );
    document.querySelector('.information-card:nth-child(1) p').textContent = languageText(
        isWorld ? 'Match both the country and place name to score.' : 'Match both the prefecture and place name to score.',
        isWorld ? '国と場所名の両方が合うと得点になります。' : '都道府県と場所名の両方が合うと得点になります。'
    );
}

function setGameType(gameType) {
    state.gameType = gameType === 'world' ? 'world' : 'japan';
    updateLocationOptions();
    updateModeUI();
    showScreen('home');
}

function startPracticeGame(gameType) {
    state.homeGameMode = 'practice';
    setGameType(gameType);
}


/* ================================================================
   5. 画面切り替え・サイドメニュー
   ================================================================ */

const SCREENS = ['home', 'game', 'result', 'proposals', 'friends', 'new-map', 'new-place', 'help'];

function showScreen(name) {
    SCREENS.forEach((screenName) => {
        const target = el[toCamelCase(screenName + '-screen')];
        if (!target) return;

        if (screenName === name) {
            target.hidden = false;
            target.classList.add('active-screen');
        } else {
            target.hidden = true;
            target.classList.remove('active-screen');
        }
    });

    if (el.mainContent) {
        el.mainContent.scrollTop = 0;
    } else {
        const main = document.getElementById('main-content');
        if (main) main.scrollTop = 0;
    }

    closeSideMenu();
}

function goHome() {
    if (isRoundInProgress()) {
        openModal(el.quitModal);
    } else {
        showScreen('home');
    }
}

function isRoundInProgress() {
    return !!(state.round && !state.round.submitted && state.session && !state.session.finished);
}

function openSideMenu() {
    el.sideMenu.classList.add('open');
    el.sideMenu.setAttribute('aria-hidden', 'false');
    el.menuOverlay.classList.add('visible');
    el.menuOverlay.setAttribute('aria-hidden', 'false');
    el.menuButton.setAttribute('aria-expanded', 'true');
}

function closeSideMenu() {
    if (!el.sideMenu) return;
    el.sideMenu.classList.remove('open');
    el.sideMenu.setAttribute('aria-hidden', 'true');
    el.menuOverlay.classList.remove('visible');
    el.menuOverlay.setAttribute('aria-hidden', 'true');
    el.menuButton.setAttribute('aria-expanded', 'false');
}


/* ================================================================
   6. 設定
   ================================================================ */

function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem('jlg-settings') || 'null');
        if (saved) {
            state.settings = Object.assign(state.settings, saved);
        }
    } catch (err) {
        /* 保存データが壊れている場合は初期値のまま */
    }

    el.questionCountSetting.value = String(state.settings.questionCount);
    state.settings.timeLimit = 120;
    el.timeLimitSetting.value = '120';
    el.animationSetting.checked = state.settings.animations;
    el.soundSetting.checked = state.settings.sound;

    applyAnimationSetting();
}

function loadProposals() {
    try {
        const saved = JSON.parse(localStorage.getItem('jlg-proposals') || '[]');
        state.proposals = Array.isArray(saved) ? saved : [];
    } catch (err) {
        state.proposals = [];
    }
    renderProposals();
}

function saveProposals() {
    localStorage.setItem('jlg-proposals', JSON.stringify(state.proposals));
}

function addFriend(event) {
    event.preventDefault();
    const name = el.friendName.value.trim();
    if (!name) return;
    state.friends.unshift({ name, addedAt: Date.now() });
    localStorage.setItem('jlg-friends', JSON.stringify(state.friends));
    el.friendForm.reset();
    renderSimpleSuggestions(el.friendList, state.friends, (friend) => friend.name);
    showNotification(languageText('Friend request sent.', 'フレンド申請を送りました。'), 'success');
}

function addMapSuggestion(event) {
    event.preventDefault();
    const suggestion = {
        name: el.newMapName.value.trim(),
        description: el.newMapDescription.value.trim()
    };
    if (!suggestion.name || !suggestion.description) return;
    state.mapSuggestions.unshift(suggestion);
    localStorage.setItem('jlg-map-suggestions', JSON.stringify(state.mapSuggestions));
    el.newMapForm.reset();
    renderSimpleSuggestions(el.newMapList, state.mapSuggestions, (item) => `${item.name} - ${item.description}`);
    showNotification(languageText('Map suggestion submitted.', '新しいマップの提案を送りました。'), 'success');
}

function addPlaceSuggestion(event) {
    event.preventDefault();
    const suggestion = {
        name: el.newPlaceName.value.trim(),
        region: el.newPlaceRegion.value.trim()
    };
    if (!suggestion.name || !suggestion.region) return;
    state.placeSuggestions.unshift(suggestion);
    localStorage.setItem('jlg-place-suggestions', JSON.stringify(state.placeSuggestions));
    el.newPlaceForm.reset();
    renderSimpleSuggestions(el.newPlaceList, state.placeSuggestions, (item) => `${item.name} - ${item.region}`);
    showNotification(languageText('Place suggestion submitted.', '新しい場所の提案を送りました。'), 'success');
}

function renderSimpleSuggestions(container, items, formatItem) {
    container.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement('article');
        card.className = 'proposal-card';
        const number = document.createElement('span');
        number.className = 'proposal-card-number';
        number.textContent = String(index + 1);
        const text = document.createElement('p');
        text.textContent = formatItem(item);
        card.append(number, text);
        container.appendChild(card);
    });
}

function loadSuggestionLists() {
    try {
        state.friends = JSON.parse(localStorage.getItem('jlg-friends') || '[]');
        state.mapSuggestions = JSON.parse(localStorage.getItem('jlg-map-suggestions') || '[]');
        state.placeSuggestions = JSON.parse(localStorage.getItem('jlg-place-suggestions') || '[]');
    } catch (error) {
        state.friends = [];
        state.mapSuggestions = [];
        state.placeSuggestions = [];
    }
    renderSimpleSuggestions(el.friendList, state.friends, (friend) => friend.name);
    renderSimpleSuggestions(el.newMapList, state.mapSuggestions, (item) => `${item.name} - ${item.description}`);
    renderSimpleSuggestions(el.newPlaceList, state.placeSuggestions, (item) => `${item.name} - ${item.region}`);
}

function addProposal(event) {
    event.preventDefault();
    const proposal = {
        name: el.proposalName.value.trim(),
        answers: el.proposalAnswer.value.split(/[、,，]/).map((value) => value.trim()).filter(Boolean),
        pref: el.proposalPrefecture.value,
        region: '提案された問題',
        lat: Number(el.proposalLatitude.value),
        lng: Number(el.proposalLongitude.value)
    };

    if (!proposal.name || !proposal.answers.length || !proposal.pref ||
        !Number.isFinite(proposal.lat) || !Number.isFinite(proposal.lng)) return;

    state.proposals.unshift(proposal);
    saveProposals();
    el.proposalForm.reset();
    renderProposals();
    showNotification(languageText('Question added.', '問題を追加しました。'), 'success');
}

function renderProposals() {
    if (!el.proposalGrid) return;
    el.proposalGrid.innerHTML = '';
    el.proposalCount.textContent = state.language === 'ja'
        ? `${state.proposals.length}問`
        : `${state.proposals.length} question${state.proposals.length === 1 ? '' : 's'}`;

    if (!state.proposals.length) {
        el.proposalGrid.innerHTML = `<p class="proposal-empty">${languageText('No suggested questions yet. Add the first one.', 'まだ提案問題がありません。最初の問題を追加しましょう。')}</p>`;
        return;
    }

    state.proposals.forEach((proposal, index) => {
        const card = document.createElement('article');
        card.className = 'proposal-card';
        card.innerHTML = `
            <span class="proposal-card-number">${index + 1}</span>
            <div>
                <h3>${escapeHtml(proposal.name)}</h3>
                <p>${escapeHtml(proposal.pref)} · ${languageText('Answers', '答え')}: ${escapeHtml(proposal.answers.join(', '))}</p>
                </div>
                <button class="secondary-button" type="button" data-proposal-index="${index}">${languageText('Play this question', 'この問題で遊ぶ')} <span>→</span></button>
        `;
        card.querySelector('button').addEventListener('click', () => startProposal(proposal));
        el.proposalGrid.appendChild(card);
    });
}

function saveSettingsFromForm() {
    state.settings.questionCount = parseInt(el.questionCountSetting.value, 10);
    state.settings.timeLimit = parseInt(el.timeLimitSetting.value, 10);
    state.settings.animations = el.animationSetting.checked;
    state.settings.sound = el.soundSetting.checked;

    localStorage.setItem('jlg-settings', JSON.stringify(state.settings));

    applyAnimationSetting();
    showNotification(languageText('Settings saved.', '設定を保存しました。'), 'success');
}

function applyAnimationSetting() {
    document.body.classList.toggle('no-animations', !state.settings.animations);
}


/* ================================================================
   7. ゲーム開始・ラウンド進行
   ================================================================ */

function startGame(mode) {
    const questionCount = mode === 'challenge'
        ? 7
        : Math.min(Math.max(state.settings.questionCount, 1), 30);
    const timeLimit = 120;

    state.session = {
        mode,
        pool: buildRoundPool(questionCount),
        index: -1,
        total: questionCount,
        timeLimit,
        totalScore: 0,
        results: [],
        startedAt: Date.now(),
        finished: false
    };

    document.body.classList.add('game-active');

    updateModeUI();

    updateScoreDisplay();
    showScreen('game');
    nextRound();
}

function startProposal(proposal) {
    state.session = {
        mode: 'proposal',
        pool: [proposal],
        index: -1,
        total: 1,
        timeLimit: 120,
        totalScore: 0,
        results: [],
        startedAt: Date.now(),
        finished: false
    };
    document.body.classList.add('game-active');
    el.gameModeLabel.textContent = languageText('COMMUNITY QUESTION', 'みんなの問題');
    updateScoreDisplay();
    showScreen('game');
    nextRound();
}

function buildRoundPool(count) {
    const availableLocations = (state.gameType === 'world' ? WORLD_LOCATIONS : LOCATIONS)
        .filter((location) => state.gameType === 'world' || !UNSUITABLE_LOCATION_NAMES.has(location.name));
    const shuffled = shuffleArray(availableLocations.slice());
    const pool = [];
    for (let i = 0; i < count; i++) {
        pool.push(shuffled[i % shuffled.length]);
    }
    return pool;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function nextRound() {
    const session = state.session;
    session.index += 1;

    if (session.index >= session.total) {
        finishGame();
        return;
    }

    const target = session.pool[session.index];
    state.round = {
        target,
        submitted: false,
        startedAt: Date.now()
    };

    el.questionNumber.textContent = languageText(`Question ${session.index + 1}`, `第${session.index + 1}問`);
    el.questionTotal.textContent = state.language === 'ja' ? `/ ${session.total}` : `/ ${session.total}`;
    el.roundValue.textContent = state.language === 'ja' ? `${session.index + 1} / ${session.total}` : `${session.index + 1} / ${session.total}`;

    resetAnswerInput();
    loadPhoto(target);
    updateHintText(target);

    startTimer(session.timeLimit);
}

function finishGame() {
    stopTimer();
    document.body.classList.remove('game-active');

    const session = state.session;
    session.finished = true;
    session.finishedAt = Date.now();

    const results = session.results;
    const correctCount = results.filter((r) => r.correct).length;

    const bestScore = results.reduce((max, r) => Math.max(max, r.score), 0);
    const elapsedMs = session.finishedAt - session.startedAt;

    el.resultScore.textContent = String(session.totalScore);
    el.resultTitle.textContent = session.mode === 'challenge'
        ? languageText('Normal mode results', '通常モードの結果')
        : languageText('Practice mode results', '練習モードの結果');
    el.shareResultText.textContent = session.mode === 'challenge'
        ? languageText('Share 7-question score', '7問のスコアを共有')
        : languageText('Share score', 'スコアを共有');
    el.resultCorrect.textContent = `${correctCount} / ${results.length}`;
    el.resultAverageDistance.textContent = languageText('Text judged', '文字入力で判定');
    el.resultBestScore.textContent = String(bestScore);
    el.resultTime.textContent = formatDuration(elapsedMs);

    renderResultItems(results);
    showScreen('result');
}

function renderResultItems(results) {
    el.resultItems.innerHTML = '';

    results.forEach((r, index) => {
        const item = document.createElement('div');
        item.className = 'result-item';

        item.innerHTML = `
            <span class="result-item-number">${index + 1}</span>
            <div class="result-item-location">
                    <strong>${escapeHtml(displayLocationName(r.target))} (${escapeHtml(displayCountryName(r.target.pref))})</strong>
                    <span>${r.skipped ? languageText('Skipped', 'スキップ') : r.answer ? (r.correct ? languageText('Correct', '正解') : languageText('Incorrect', '不正解')) : languageText('No answer', '未回答')}</span>
            </div>
                <span class="result-item-score">${r.score} ${languageText('pt', '点')}</span>
        `;

        el.resultItems.appendChild(item);
    });
}


/* ================================================================
   8. 写真マップ（出題側 = 航空写真の代わりに衛星タイルを表示）
   ================================================================ */

function ensurePhotoMap() {
    if (state.photoMap) return;

    const mapDiv = document.createElement('div');
    mapDiv.id = 'photo-map';
    mapDiv.style.position = 'absolute';
    mapDiv.style.inset = '0';
    mapDiv.style.zIndex = '0';
    el.photoContainer.insertBefore(mapDiv, el.photoContainer.firstChild);

    state.photoMap = L.map(mapDiv, {
        zoomControl: true,
        dragging: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: false,
        touchZoom: true,
        attributionControl: true
    });

    state.photoTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            maxZoom: 18,
            attribution: 'Tiles &copy; Esri'
        }
    ).addTo(state.photoMap);
}

function loadPhoto(target) {
    ensurePhotoMap();

    el.photoPlaceholder.hidden = true;
    el.photoError.hidden = true;
    el.photoLoading.hidden = false;

    let loaded = false;
    const finishLoading = () => {
        if (loaded) return;
        loaded = true;
        el.photoLoading.hidden = true;
        setTimeout(() => state.photoMap.invalidateSize(), 50);
    };

    state.photoTileLayer.once('load', finishLoading);
    setTimeout(finishLoading, 2500); // フォールバック

    state.photoMap.setView([target.lat, target.lng], 15, { animate: false });
    setTimeout(() => state.photoMap.invalidateSize(), 50);

    el.photoSourceLabel.textContent = languageText('SATELLITE VIEW', '衛星画像');
    el.photoCaption.textContent = languageText('Guess the location from the image.', '画像から場所を推理してください。');
    el.photoMetaResolution.textContent = languageText('Zoom 15', 'ズーム 15');
    el.photoMetaType.textContent = languageText('Aerial', '航空写真');
}

function toggleFullscreenPhoto() {
    if (!document.fullscreenElement) {
        el.photoContainer.requestFullscreen?.().catch(() => {
            showNotification(languageText('Fullscreen is not supported.', '全画面表示には対応していません。'), 'error');
        });
    } else {
        document.exitFullscreen?.();
    }
}


/* ================================================================
   9. 回答マップ
   ================================================================ */

function initAnswerMap() {
    state.answerMap = L.map(el.map, {
        zoomControl: true,
        minZoom: 5,
        maxZoom: 14
    }).setView(state.gameType === 'world' ? WORLD_CENTER : JAPAN_CENTER, state.gameType === 'world' ? WORLD_DEFAULT_ZOOM : JAPAN_DEFAULT_ZOOM);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(state.answerMap);

    state.answerMap.on('load', () => {
        el.mapPlaceholder.hidden = true;
    });
    setTimeout(() => {
        el.mapPlaceholder.hidden = true;
        state.answerMap.invalidateSize();
    }, 800);

    state.answerMap.on('click', (e) => {
        if (!state.round || state.round.submitted) return;
        setAnswerMarker(e.latlng);
    });
}

function resetAnswerInput() {
    el.prefectureInput.value = '';
    el.answerInput.value = '';
    el.submitAnswerButton.disabled = true;
}

function markerIcon(color) {
    return L.divIcon({
        className: 'jlg-marker',
        html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 3px rgba(0,0,0,0.35);"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}


/* ================================================================
   10. 回答送信・採点・結果モーダル
   ================================================================ */

function submitAnswer() {
    if (!state.round || state.round.submitted) return;
    const answer = normalizeAnswer(el.answerInput.value);
    const prefecture = el.prefectureInput.value;
    if (!prefecture || !answer) return;

    stopTimer();
    completeRound(prefecture, answer);
}

function handleTimeUp() {
    if (!state.round || state.round.submitted) return;
    showNotification(languageText('Time is up.', '時間切れです。'), 'error');
    completeRound(null, null, false);
}

function skipAnswer() {
    if (!state.round || state.round.submitted) return;

    stopTimer();
    completeRound(null, null, true);
}

function completeRound(prefecture, answer, skipped) {
    const round = state.round;
    const target = round.target;

    round.submitted = true;

    const prefectureCorrect = prefecture === target.pref;
    const nameCorrect = isAnswerCorrect(answer, target);
    const isCorrect = prefectureCorrect && nameCorrect;
    const distanceKm = isCorrect ? 0 : null;
    const score = (prefectureCorrect ? 2500 : 0) + (nameCorrect ? 2500 : 0);

    state.session.totalScore += score;
    state.session.results.push({ target, prefecture, answer, distanceKm, score, correct: isCorrect, prefectureCorrect, nameCorrect, skipped });

    updateScoreDisplay();
    showAnswerResult(target, prefecture, answer, distanceKm, score, isCorrect, skipped);
}

function normalizeAnswer(value) {
    return value.trim().replace(/[\s　]/g, '').toLowerCase();
}

function isAnswerCorrect(answer, target) {
    if (!answer) return false;

    return [target.name, displayLocationName(target), `${target.pref}${target.name}`, ...(target.answers || [])]
        .some((value) => normalizeAnswer(value) === answer);
}

function calcScore(distanceKm) {
    const maxScore = 5000;
    const scale = 60;

    if (distanceKm < 0.3) return maxScore;

    const score = Math.round(maxScore * Math.exp(-distanceKm / scale));
    return Math.max(0, Math.min(maxScore, score));
}

function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

function showAnswerResult(target, prefecture, answer, distanceKm, score, isCorrect, skipped) {
    el.answerScore.textContent = String(score);
    el.resultStatusLabel.textContent = skipped ? languageText('SKIPPED', 'スキップ') : isCorrect ? languageText('CORRECT', '正解') : languageText('INCORRECT', '不正解');
    el.correctLocationName.textContent = `${displayLocationName(target)}（${displayCountryName(target.pref)}）`;
    el.answerDistance.textContent = skipped ? languageText('Skipped', 'スキップ') : answer ? (isCorrect ? languageText('Correct', '正解') : languageText('Incorrect', '不正解')) : languageText('No answer', '未回答');
    el.playerLocationName.textContent = skipped ? languageText('Skipped', 'スキップ') : prefecture && answer
        ? `${prefecture} ${answer}`
        : languageText('No answer', '未回答');

    openModal(el.answerResultModal);
    renderResultMap(target, null);
    playChime(score > 0);
}

function renderResultMap(target, latlng) {
    if (state.resultMap) {
        state.resultMap.remove();
        state.resultMap = null;
    }

    state.resultMap = L.map(el.resultMap, {
        zoomControl: false,
        dragging: true,
        scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(state.resultMap);

    const correctMarker = L.marker([target.lat, target.lng], { icon: markerIcon('#38d996') })
        .addTo(state.resultMap);

    const bounds = [[target.lat, target.lng]];

    if (latlng) {
        L.marker(latlng, { icon: markerIcon('#ff6678') }).addTo(state.resultMap);
        L.polyline([[target.lat, target.lng], [latlng.lat, latlng.lng]], {
            color: '#f7b955',
            weight: 2,
            dashArray: '5,7'
        }).addTo(state.resultMap);
        bounds.push([latlng.lat, latlng.lng]);
    }

    setTimeout(() => {
        state.resultMap.invalidateSize();
        if (bounds.length > 1) {
            state.resultMap.fitBounds(bounds, { padding: [30, 30] });
        } else {
            state.resultMap.setView(bounds[0], 12);
        }
    }, 50);

    correctMarker.bindPopup(displayLocationName(target));
}

function updateScoreDisplay() {
    el.scoreValue.textContent = String(state.session ? state.session.totalScore : 0);
}


/* ================================================================
   11. タイマー
   ================================================================ */

function startTimer(seconds) {
    stopTimer();

    if (!seconds) {
        el.timerValue.textContent = '∞';
        return;
    }

    let remaining = seconds;
    el.timerValue.textContent = String(remaining);
    document.body.classList.remove('timer-warning');

    state.timerId = setInterval(() => {
        remaining -= 1;
        el.timerValue.textContent = String(Math.max(remaining, 0));

        if (remaining <= 10) {
            document.body.classList.add('timer-warning');
        }

        if (remaining <= 0) {
            stopTimer();
            handleTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
    document.body.classList.remove('timer-warning');
}


/* ================================================================
   12. ヒント・終了確認モーダル
   ================================================================ */

function updateHintText(target) {
    const type = getLocationType(target);
    const hint = state.language === 'ja'
        ? `これは${type}です。`
        : `This is ${type}.`;
    el.hintText.textContent = hint;
    el.hintModalText.textContent = hint;
}

function getLocationType(target) {
    const name = target.name;

    const type = name.includes('空港') ? ['an airport or runway', '空港や滑走路']
        : name.includes('ジャンクション') ? ['a highway junction', '高速道路のジャンクション']
            : name.includes('インターチェンジ') ? ['an interchange', 'インターチェンジ']
                : name.endsWith('駅') ? ['a train station', '駅']
                    : name.includes('城') ? ['a castle', '城']
                        : /寺|神社|神宮|大社|宮|堂/.test(name) ? ['a temple or historic landmark', '寺院や歴史的な名所']
                            : name.includes('島') ? ['an island', '島']
                                : /山|湖|沼|砂丘|峡|湾|浜|松原|高原|温泉|渦潮/.test(name) ? ['a natural landmark', '自然の名所']
                                    : ['a landmark', '名所'];
    return languageText(type[0], type[1]);
}

function openModal(modal) {
    modal.hidden = false;
    state.activeModal = modal;
}

function closeModal(modal) {
    modal.hidden = true;
    if (state.activeModal === modal) {
        state.activeModal = null;
    }
}

function closeAnyOpenModal() {
    if (state.activeModal) {
        closeModal(state.activeModal);
    }
}


/* ================================================================
   13. 通知・ユーティリティ
   ================================================================ */

function showNotification(message, type) {
    const note = document.createElement('div');
    note.className = 'notification';
    note.textContent = message;

    if (type === 'success') note.style.borderColor = 'rgba(56, 217, 150, 0.4)';
    if (type === 'error') note.style.borderColor = 'rgba(255, 102, 120, 0.4)';

    el.notificationContainer.appendChild(note);

    setTimeout(() => {
        note.classList.add('is-removing');
        setTimeout(() => note.remove(), 200);
    }, 3000);
}

function formatDistance(km) {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function shareResults() {
    if (!state.session || !state.session.results.length) return;
    const session = state.session;
    const correctCount = session.results.filter((result) => result.correct).length;
    const modeLabel = session.mode === 'challenge'
        ? languageText('Normal mode (7 questions)', '通常モード（7問）')
        : languageText(`Practice mode (${session.results.length} questions)`, `練習モード（${session.results.length}問）`);
    const text = languageText(
        `Where's this? ${modeLabel}\nScore: ${session.totalScore} points / ${correctCount} correct\n${session.results.map((result, index) => `${index + 1}. ${displayLocationName(result.target)}: ${result.correct ? 'Correct' : 'Incorrect'}`).join('\n')}`,
        `日本どこでしょう？ ${modeLabel}\nスコア：${session.totalScore}ポイント / ${correctCount}問正解\n${session.results.map((result, index) => `${index + 1}. ${displayLocationName(result.target)}: ${result.correct ? '正解' : '不正解'}`).join('\n')}`
    );

    if (navigator.share) {
        navigator.share({ title: languageText("Where's this? Results", '日本どこでしょう？ 結果'), text }).catch(() => {});
        return;
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showNotification('Sharing is not supported.', 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showNotification('Results copied to the clipboard.', 'success');
    }).catch(() => showNotification('Sharing is not supported.', 'error'));
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

let audioCtx = null;
function playChime(success) {
    if (!state.settings.sound) return;

    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.frequency.value = success ? 660 : 220;
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch (err) {
        /* 音声再生に失敗しても無視 */
    }
}


/* ================================================================
   イベント登録
   ================================================================ */

function bindEvents() {
    el.languageSelect.addEventListener('change', () => setLanguage(el.languageSelect.value));

    /* ヘッダー / サイドメニュー */
    el.menuButton.addEventListener('click', openSideMenu);
    el.closeMenuButton.addEventListener('click', closeSideMenu);
    el.menuOverlay.addEventListener('click', closeSideMenu);
    el.logo.addEventListener('click', (e) => { e.preventDefault(); goHome(); });

    el.menuHome.addEventListener('click', () => {
        state.homeGameMode = 'challenge';
        goHome();
    });
    el.menuPractice.addEventListener('click', () => {
        state.homeGameMode = 'practice';
        showScreen('home');
    });
    el.menuFriends.addEventListener('click', () => showScreen('friends'));
    el.menuNewMap.addEventListener('click', () => showScreen('new-map'));
    el.menuNewPlace.addEventListener('click', () => showScreen('new-place'));
    el.footerHelpButton.addEventListener('click', () => showScreen('help'));

    /* ホーム画面 */
    el.startChallengeButton.addEventListener('click', () => {
        setGameType('japan');
        startGame(state.homeGameMode);
    });
    el.startPracticeButton.addEventListener('click', () => {
        setGameType('world');
        startGame(state.homeGameMode);
    });
    el.proposalForm.addEventListener('submit', addProposal);
    el.friendForm.addEventListener('submit', addFriend);
    el.newMapForm.addEventListener('submit', addMapSuggestion);
    el.newPlaceForm.addEventListener('submit', addPlaceSuggestion);

    /* ゲーム画面 */
    el.photoFullscreenButton.addEventListener('click', toggleFullscreenPhoto);
    el.submitAnswerButton.addEventListener('click', submitAnswer);
    el.skipAnswerButton.addEventListener('click', skipAnswer);
    const updateAnswerButton = () => {
        el.submitAnswerButton.disabled = !el.prefectureInput.value || !normalizeAnswer(el.answerInput.value);
    };
    el.prefectureInput.addEventListener('change', updateAnswerButton);
    el.answerInput.addEventListener('input', updateAnswerButton);
    el.hintButton.addEventListener('click', () => openModal(el.hintModal));

    /* 回答結果モーダル */
    el.closeResultModalButton.addEventListener('click', () => closeModal(el.answerResultModal));
    el.nextQuestionButton.addEventListener('click', () => {
        closeModal(el.answerResultModal);
        nextRound();
    });

    /* ヒントモーダル */
    el.closeHintModalButton.addEventListener('click', () => closeModal(el.hintModal));
    el.closeHintButton.addEventListener('click', () => closeModal(el.hintModal));

    /* 終了確認モーダル */
    el.cancelQuitButton.addEventListener('click', () => closeModal(el.quitModal));
    el.confirmQuitButton.addEventListener('click', () => {
        stopTimer();
        document.body.classList.remove('game-active');
        state.round = null;
        if (state.session) state.session.finished = true;
        closeModal(el.quitModal);
        showScreen('home');
    });

    /* 結果画面 */
    el.playAgainButton.addEventListener('click', () => {
        if (state.session) startGame(state.session.mode);
    });
    el.backHomeButton.addEventListener('click', () => showScreen('home'));
    el.shareResultButton.addEventListener('click', shareResults);

    /* 設定画面 */
    el.saveSettingsButton.addEventListener('click', saveSettingsFromForm);

    /* モーダル背景クリックで閉じる（終了確認以外） */
    [el.answerResultModal, el.hintModal].forEach((modal) => {
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) backdrop.addEventListener('click', () => closeModal(modal));
    });

    /* キーボード操作 */
    document.addEventListener('keydown', handleKeydown);
}


/* ================================================================
   14. キーボード操作
   ================================================================ */

function handleKeydown(e) {
    if (e.key === 'Escape') {
        closeAnyOpenModal();
        return;
    }

    if (state.activeModal) return; // モーダル表示中はゲーム操作を無効化

    if (el.gameScreen.hidden) return;

    if (e.key === 'Enter') {
        if (!el.submitAnswerButton.disabled) {
            submitAnswer();
        }
    } else if (e.key === 'h' || e.key === 'H') {
        openModal(el.hintModal);
    }
}
