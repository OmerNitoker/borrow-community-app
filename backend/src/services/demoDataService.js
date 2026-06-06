import bcrypt from "bcryptjs";
import { Community } from "../models/Community.js";
import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";
import { User } from "../models/User.js";

const demoPassword = "demo123456";
const demoAdminEmail = "demo-admin@borrow.local";
const demoMemberEmail = "demo-member@borrow.local";
const demoJoinCode = "DEMO2026";
const demoEntryEmails = {
  admin: demoAdminEmail,
  member: demoMemberEmail
};

const approvedDemoUsers = [
  { name: "מנהל דמו", email: demoAdminEmail, phone: "050-123-4567", role: "admin" },
  { name: "חבר דמו", email: demoMemberEmail, phone: "050-123-4568", role: "member" },
  { name: "נועה לוי", email: "noa@borrow.local", phone: "050-201-1001", role: "member" },
  { name: "יואב כהן", email: "yoav@borrow.local", phone: "050-201-1002", role: "member" },
  { name: "מיכל אברהם", email: "michal@borrow.local", phone: "050-201-1003", role: "member" },
  { name: "איתי פרץ", email: "itai@borrow.local", phone: "050-201-1004", role: "member" },
  { name: "רוני מזרחי", email: "roni@borrow.local", phone: "050-201-1005", role: "member" },
  { name: "דניאל שפירא", email: "daniel@borrow.local", phone: "050-201-1006", role: "member" },
  { name: "תמר גולן", email: "tamar@borrow.local", phone: "050-201-1007", role: "member" },
  { name: "עומר ברק", email: "omer@borrow.local", phone: "050-201-1008", role: "member" },
  { name: "שירה דיין", email: "shira@borrow.local", phone: "050-201-1009", role: "member" }
];

const pendingDemoUsers = [
  { name: "ליאור סגל", email: "pending-lior@borrow.local", phone: "050-301-2001" },
  { name: "הילה רוזן", email: "pending-hila@borrow.local", phone: "050-301-2002" },
  { name: "אורי נבון", email: "pending-uri@borrow.local", phone: "050-301-2003" }
];

const allDemoUsers = [...approvedDemoUsers, ...pendingDemoUsers];
// {url:"", publicId:""}
const demoItems = [
  item(demoMemberEmail, "מחצלת גדולה", "מחצלת מתקפלת לפיקניקים וים.", "ציוד טיולים", "good", "נא לנער חול לפני ההחזרה.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780661656/borrow/carpet_vbpjir.jpg", publicId:"borrow/carpet_vbpjir"}]),
  item(demoMemberEmail, "מברגה נטענת", "מברגה ביתית עם סוללה ומטען.", "כלי עבודה", "good", "כוללת ביטים בסיסיים."),
  item(demoAdminEmail, "צידנית משפחתית", "צידנית קשיחה לטיולים וים.", "ציוד טיולים", "used", "מתאימה לבקבוקים וקרחונים.", [{url: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780552368/borrow/cooler1_gmpgmb.jpg", publicId:"borrow/cooler1_gmpgmb"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780552489/borrow/cooler3_rbuttl.jpg", publicId:"borrow/cooler3_rbuttl"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780552487/borrow/cooler2_kb6uyh.jpg", publicId:"borrow/cooler2_kb6uyh"}]),
  item(demoAdminEmail, "ערכת קפה", "פקל קפה קטן עם גזיה, פינג'ן וכוסות.", "ציוד טיולים", "good", "לא כולל בלון גז.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780555882/borrow/coffee1_vwo8zt.jpg", publicId:"borrow/coffee1_vwo8zt"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780555883/borrow/coffee2_fbdopd.jpg", publicId:"borrow/coffee2_fbdopd"}]),
  item("noa@borrow.local", "מכסחת דשא", "מכסחת חשמלית לחצר קטנה או בינונית.", "כלי עבודה", "used", "יש להחזיר נקיה מדשא.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780556189/borrow/mower1_wjwcmt.jpg", publicId:"borrow/mower1_wjwcmt"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780556188/borrow/mower2_jns9ke.jpg", publicId:"borrow/mower2_jns9ke"}]),
  item("noa@borrow.local", "תבנית קוגלהוף", "תבנית אפייה איכותית לעוגות.", "כלי מטבח", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780556703/borrow/kugelhof1_geitif.jpg", publicId:"borrow/kugelhof1_geitif"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780556704/borrow/kugelhof2_ikmonr.jpg", publicId:"borrow/kugelhof2_ikmonr"}]),
  item("noa@borrow.local", "שולחן מתקפל", "שולחן פלסטיק מתקפל לאירוח.", "ציוד לאירועים", "good", "מתאים ל-6 אנשים.", {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780556984/borrow/table_ml0dcw.jpg", publicId:"borrow/table_ml0dcw"}),
  item("noa@borrow.local", "כיסאות מתקפלים", "סט של ארבעה כיסאות מתקפלים.", "ציוד לאירועים", "used", "אפשר לקחת גם חלק מהסט.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780568214/borrow/chairs1_cnaexk.jpg", publicId:"borrow/chairs1_cnaexk"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780568213/borrow/chairs2_xfnhai.jpg", publicId:"borrow/chairs2_xfnhai"}]),
  item("noa@borrow.local", "משאבת אוויר", "משאבה לניפוח מזרנים וכדורים.", "ציוד ספורט", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780568508/borrow/pump_ipzdzg.jpg", publicId:"borrow/pump_ipzdzg"}]),
  item("yoav@borrow.local", "מפוח עלים", "מפוח חשמלי לניקוי חצר ושביל.", "כלי עבודה", "used", "עם כבל מאריך קצר.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780568970/borrow/leaf1_jauckt.jpg", publicId:"borrow/leaf1_jauckt"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780568941/borrow/leaf2_zz2lmp.jpg", publicId:"borrow/leaf2_zz2lmp"}]),
  item("yoav@borrow.local", "חרמש חשמלי", "חרמש קל לקצוות דשא.", "כלי עבודה", "needs-care", "עובד, אבל החוט נגמר יחסית מהר.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780569288/borrow/trimmer1_ujzm6k.jpg", publicId:"borrow/trimmer1_ujzm6k"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780569289/borrow/trimmer2_twxrgt.jpg", publicId:"borrow/trimmer2_twxrgt"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780569289/borrow/trimmer3_qj64tz.jpg", publicId:"borrow/trimmer3_qj64tz"}]),
  item("yoav@borrow.local", "סולם 3 שלבים", "סולם ביתי קל ונוח.", "כלי עבודה", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780569492/borrow/ledder2_e79xjp.jpg", publicId:"borrow/ledder2_e79xjp"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780569491/borrow/ledder1_fkh3rx.jpg", publicId:"borrow/ledder1_fkh3rx"}]),
  item("yoav@borrow.local", "ערכת מברגים", "סט מברגים בגדלים שונים.", "כלי עבודה", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780661928/borrow/screw1_zzjmy4.jpg", publicId:"borrow/screw1_zzjmy4"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780661930/borrow/screw2_cvdcp9.jpg", publicId:"borrow/screw2_cvdcp9"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780661931/borrow/screw3_vsuthz.jpg", publicId:"borrow/screw3_vsuthz"}]),
  item("yoav@borrow.local", "ארגז כלים", "ארגז כלים בסיסי לעבודות קטנות.", "כלי עבודה", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780662158/borrow/toolbox1_k0rr7u.jpg", publicId:"borrow/toolbox1_k0rr7u"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780662159/borrow/toolbox2_yvrje9.jpg", publicId:"borrow/toolbox2_yvrje9"}]),
  item("yoav@borrow.local", "רשת כדורעף", "רשת מתקפלת למשחק בחצר או בפארק.", "ציוד ספורט", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780662317/borrow/net2_vdj1kv.jpg", publicId:"borrow/net2_vdj1kv"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780662318/borrow/net1_nc53xf.jpg", publicId:"borrow/net1_nc53xf"}]),
  item("michal@borrow.local", "סיר גדול", "סיר ענק לבישול לקבוצה.", "כלי מטבח", "good", "מעולה למרקים ותבשילים.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780662539/borrow/pot_ndp1kt.jpg", publicId:"borrow/pot_ndp1kt"}]),
  item("michal@borrow.local", "מכונת פסטה", "מכונה ידנית להכנת פסטה ביתית.", "כלי מטבח", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663100/borrow/pasta1_oyxdro.jpg", publicId:"borrow/pasta1_oyxdro"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663098/borrow/pasta2_vzsbyp.jpg", publicId:"borrow/pasta2_vzsbyp"}]),
  item("michal@borrow.local", "מיקסר ידני", "מיקסר להכנת עוגות ובצקים קלים.", "כלי מטבח", "good", "לא מתאים לבצק כבד.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663254/borrow/mixer_vuilkn.jpg", publicId:"borrow/mixer_vuilkn"}]),
  item("michal@borrow.local", "מגש אירוח", "מגש עץ גדול להגשה.", "ציוד לאירועים", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663387/borrow/trey_nf7poi.jpg", publicId:"borrow/trey_nf7poi"}]),
  item("michal@borrow.local", "סט צלחות לאירוח", "סט של 12 צלחות לבנות.", "ציוד לאירועים", "good", "נא להחזיר שטוף.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663489/borrow/plates_srdny6.jpg", publicId:"borrow/plates_srdny6"}]),
  item("itai@borrow.local", "אוהל משפחתי", "אוהל גדול ונוח לטיולי סוף שבוע.", "ציוד טיולים", "good", "נא להחזיר יבש ונקי.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663597/borrow/tent_sbsamr.jpg", publicId:"borrow/tent_sbsamr"}]),
  item("itai@borrow.local", "שק שינה", "שק שינה קל לעונת מעבר.", "ציוד טיולים", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663818/borrow/sleepingbag1_wbewuz.jpg", publicId:"borrow/sleepingbag1_wbewuz"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780663821/borrow/sleepingbag2_jfveiz.jpg", publicId:"borrow/sleepingbag2_jfveiz"}]),
  item("itai@borrow.local", "פנס ראש", "פנס ראש נטען לטיולים.", "ציוד טיולים", "good", "כולל כבל טעינה.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664033/borrow/flashlight_q4v4ns.jpg", publicId:"borrow/flashlight_q4v4ns"}]),
  item("itai@borrow.local", "מנשא תינוק לטיולים", "מנשא גב לטיולים קצרים.", "ציוד טיולים", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664230/borrow/carrier_rf6gqo.jpg", publicId:"borrow/carrier_rf6gqo"}]),
  item("roni@borrow.local", "גיטרה קלאסית", "גיטרה קלאסית למתחילים.", "כלי נגינה", "used", "מגיעה עם נרתיק.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664366/borrow/guitar1_cftyao.jpg", publicId:"borrow/guitar1_cftyao"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664368/borrow/guitar2_lzskv5.jpg", publicId:"borrow/guitar2_lzskv5"}]),
  item("roni@borrow.local", "קלידים קטנים", "קלידים קומפקטיים לילדים ולמתחילים.", "כלי נגינה", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664509/borrow/keyboard_jb9mse.jpg", publicId:"borrow/keyboard_jb9mse"}]),
  item("roni@borrow.local", "מעמד תווים", "מעמד מתקפל לתווים.", "כלי נגינה", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664626/borrow/stand1_auxg85.jpg", publicId:"borrow/stand1_auxg85"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780664627/borrow/stand2_cqevti.jpg", publicId:"borrow/stand2_cqevti"}]),
  item("roni@borrow.local", "רמקול בלוטות'", "רמקול נייד לאירועים קטנים.", "ציוד לאירועים", "good", "נא לא להשתמש בגשם.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665191/borrow/jbl1_ehfjre.jpg", publicId:"borrow/jbl1_ehfjre"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665191/borrow/jbl2_fvy476.jpg", publicId:"borrow/jbl2_fvy476"}]),
  item("roni@borrow.local", "מיקרופון חוטי", "מיקרופון פשוט לערבי קריוקי.", "ציוד לאירועים", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665323/borrow/microphone1_xt19w3.jpg", publicId:"borrow/microphone1_xt19w3"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665358/borrow/microphone2_yiqta9.jpg", publicId:"borrow/microphone2_yiqta9"}]),
  item("roni@borrow.local", "כבל מאריך 20 מטר", "כבל מאריך לשימוש ביתי ואירועים.", "כלי עבודה", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665480/borrow/cable_dmtp0o.jpg", publicId:"borrow/cable_dmtp0o"}]),
  item("daniel@borrow.local", "מחבטי טניס", "זוג מחבטים במצב טוב.", "ציוד ספורט", "good", "מתאים למשחק חובבני.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665598/borrow/tennis_sn2n02.jpg", publicId:"borrow/tennis_sn2n02"}]),
  item("daniel@borrow.local", "כדורגל", "כדורגל בגודל 5.", "ציוד ספורט", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665685/borrow/football_chxilr.jpg", publicId:"borrow/football_chxilr"}]),
  item("daniel@borrow.local", "משקולות יד", "זוג משקולות של 5 קילו.", "ציוד ספורט", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665817/borrow/dumbbells_cjb3os.jpg", publicId:"borrow/dumbbells_cjb3os"}]),
  item("daniel@borrow.local", "מזרן יוגה", "מזרן יוגה עבה ונוח.", "ציוד ספורט", "good", "נא לנקות אחרי שימוש.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665984/borrow/yoga1_xeazty.jpg", publicId:"borrow/yoga1_xeazty"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780665981/borrow/yoga2_skloip.jpg", publicId:"borrow/yoga2_skloip"}]),
  item("daniel@borrow.local", "קסדת אופניים", "קסדה למבוגר במידה בינונית.", "ציוד ספורט", "good", "",[{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666141/borrow/helmet_dqqalr.jpg", publicId:"borrow/helmet_dqqalr"}]),
  item("tamar@borrow.local", "מקרן נייד", "מקרן קטן לערבי סרטים ומצגות.", "ציוד לאירועים", "good", "כולל כבל HDMI.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666278/borrow/movieproj_xzl4w6.jpg", publicId:"borrow/movieproj_xzl4w6"}]),
  item("tamar@borrow.local", "מסך הקרנה", "מסך הקרנה מתקפל.", "ציוד לאירועים", "used", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666383/borrow/screen_wyrcs2.jpg", publicId:"borrow/screen_wyrcs2"}]),
  item("tamar@borrow.local", "שרשרת תאורה", "גרילנדת תאורה לאירועי ערב.", "ציוד לאירועים", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666503/borrow/grilanda_zmlbcc.jpg", publicId:"borrow/grilanda_zmlbcc"}]),
  item("tamar@borrow.local", "מפת שולחן חגיגית", "מפה גדולה לאירוח.", "ציוד לאירועים", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666643/borrow/tablecover_wv85v7.jpg", publicId:"borrow/tablecover_wv85v7"}]),
  item("tamar@borrow.local", "קנקן שתייה גדול", "קנקן זכוכית עם ברז.", "כלי מטבח", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666750/borrow/glass-jug_p8ang4.jpg", publicId:"borrow/glass-jug_p8ang4"}]),
  item("omer@borrow.local", "גריל פחמים קטן", "גריל נייד לפיקניקים.", "ציוד טיולים", "used", "להחזיר נקי ככל האפשר.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780666927/borrow/grill_tonigg.jpg", publicId:"borrow/grill_tonigg"}]),
  item("omer@borrow.local", "צילייה", "צילייה קלה לים ופארק.", "ציוד טיולים", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780667028/borrow/shade_ajeoxz.jpg", publicId:"borrow/shade_ajeoxz"}]),
  item("omer@borrow.local", "גזיבו מתקפל", "גזיבו 3x3 לאירועים בחצר.", "ציוד לאירועים", "used", "דורש שני אנשים להרכבה.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780667259/borrow/gazebo_oej2gp.jpg", publicId:"borrow/gazebo_oej2gp"}]),
  item("omer@borrow.local", "ערכת בדמינטון", "שני מחבטים ורשת קטנה.", "ציוד ספורט", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780682572/borrow/badminton1_c2waqm.jpg", publicId:"borrow/badminton1_c2waqm"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780682546/borrow/badminton2_v7yvsr.jpg", publicId:"borrow/badminton2_v7yvsr"}]),
  item("omer@borrow.local", "סט קופסאות אחסון", "קופסאות גדולות להעברת ציוד.", "אחר", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780682790/borrow/box_yxdquq.jpg", publicId:"borrow/box_yxdquq"}]),
  item("shira@borrow.local", "מכונת בועות", "מכונת בועות לאירועי ילדים.", "ציוד לאירועים", "good", "לא כולל נוזל בועות.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780682928/borrow/bubble_ob2koq.jpg", publicId:"borrow/bubble_ob2koq"}]),
  item("shira@borrow.local", "תחפושת פיראט", "תחפושת לילדים לגילאי 5-7.", "אחר", "good", "", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780683078/borrow/pirate_btjpfb.jpg", publicId:"borrow/pirate_btjpfb"}]),
  item("shira@borrow.local", "מכונת תפירה", "מכונת תפירה ביתית פשוטה.", "אחר", "used", "מתאימה לתיקונים קלים.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780683174/borrow/sewing_lqsz47.jpg", publicId:"borrow/sewing_lqsz47"}]),
  item("shira@borrow.local", "ערכת יצירה לילדים", "קופסה עם חומרים לפעילות יצירה.", "אחר", "good", "חלק מהחומרים מתכלים.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780683370/borrow/craftkit1_oxxpqr.jpg", publicId:"borrow/craftkit1_oxxpqr"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780683372/borrow/craftkit2_btamun.jpg", publicId:"borrow/craftkit2_btamun"}]),
  item("shira@borrow.local", "מצלמת אקסטרים", "מצלמת אקשן קטנה לטיולים.", "אחר", "used", "כולל כרטיס זיכרון קטן.", [{url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780683516/borrow/camera2_kpwacw.jpg", publicId:"borrow/camera2_kpwacw"}, {url:"https://res.cloudinary.com/dmhaze3tc/image/upload/v1780683514/borrow/camera1_vtnddl.jpg", publicId:"borrow/camera1_vtnddl"}])
];

export async function seedDemoData({ reset = false, entryMode = "member" } = {}) {
  if (reset) {
    const existingDemoUsers = await User.find({ isDemoUser: true }).select("_id");
    const existingDemoCommunities = await Community.find({ isDemoCommunity: true }).select("_id");
    const demoUserIds = existingDemoUsers.map((user) => user._id);
    const demoCommunityIds = existingDemoCommunities.map((community) => community._id);

    await Item.deleteMany({
      $or: [{ isDemoItem: true }, { owner: { $in: demoUserIds } }, { community: { $in: demoCommunityIds } }]
    });
    await Membership.deleteMany({
      $or: [{ user: { $in: demoUserIds } }, { community: { $in: demoCommunityIds } }]
    });
    await Community.deleteMany({ isDemoCommunity: true });
    await User.deleteMany({ isDemoUser: true });
  } else {
    await removeObsoleteDemoUsers();
  }

  const passwordHash = await bcrypt.hash(demoPassword, 12);
  const usersByEmail = new Map();

  for (const demoUser of allDemoUsers) {
    const user = await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        phone: demoUser.phone,
        isDemoUser: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    usersByEmail.set(demoUser.email, user);
  }

  const adminUser = usersByEmail.get(demoAdminEmail);
  const memberUser = usersByEmail.get(demoMemberEmail);

  const community = await Community.findOneAndUpdate(
    { joinCode: demoJoinCode },
    {
      name: "קהילת הדמו",
      description: "קהילה לדוגמה שמציגה קטלוג עשיר, חברות והרשאות קשר.",
      joinCode: demoJoinCode,
      requiredApproval: true,
      createdBy: adminUser._id,
      isDemoCommunity: true,
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  for (const demoUser of approvedDemoUsers) {
    const user = usersByEmail.get(demoUser.email);

    await Membership.findOneAndUpdate(
      { user: user._id, community: community._id },
      {
        user: user._id,
        community: community._id,
        status: "approved",
        role: demoUser.role
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const pendingUser of pendingDemoUsers) {
    const user = usersByEmail.get(pendingUser.email);

    const existingMembership = await Membership.findOne({ user: user._id, community: community._id });

    if (!existingMembership) {
      await Membership.create({
        user: user._id,
        community: community._id,
        status: "pending",
        role: "member"
      });
    }
  }

  const [existingDemoItemCount, memberDemoItemCount] = await Promise.all([
    Item.countDocuments({ community: community._id, isDemoItem: true }),
    Item.countDocuments({ community: community._id, owner: memberUser._id, isDemoItem: true })
  ]);

  if (existingDemoItemCount !== demoItems.length || memberDemoItemCount !== 2) {
    await Item.deleteMany({ community: community._id, isDemoItem: true });
    await Item.insertMany(
      demoItems.map((demoItem, index) => ({
        ...demoItem,
        community: community._id,
        owner: usersByEmail.get(demoItem.ownerEmail)._id,
        isActive: true,
        isDemoItem: true,
        createdAt: new Date(Date.now() - index * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - index * 60 * 60 * 1000)
      }))
    );
  }

  const entryEmail = demoEntryEmails[entryMode] || demoEntryEmails.member;

  return { user: usersByEmail.get(entryEmail), community };
}

async function removeObsoleteDemoUsers() {
  const activeDemoEmails = allDemoUsers.map((user) => user.email);
  const obsoleteDemoUsers = await User.find({
    isDemoUser: true,
    email: { $nin: activeDemoEmails }
  }).select("_id");

  if (obsoleteDemoUsers.length === 0) {
    return;
  }

  const obsoleteUserIds = obsoleteDemoUsers.map((user) => user._id);

  await Item.deleteMany({ owner: { $in: obsoleteUserIds } });
  await Membership.deleteMany({ user: { $in: obsoleteUserIds } });
  await User.deleteMany({ _id: { $in: obsoleteUserIds } });
}

function item(ownerEmail, title, description, category, condition, notes, images = []) {
  return {
    ownerEmail,
    title,
    description,
    notes,
    condition,
    category,
    images
  };
}
