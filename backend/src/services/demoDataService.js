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

const demoItems = [
  item(demoMemberEmail, "מחצלת גדולה", "מחצלת מתקפלת לפיקניקים וים.", "ציוד טיולים", "good", "נא לנער חול לפני ההחזרה."),
  item(demoMemberEmail, "מברגה נטענת", "מברגה ביתית עם סוללה ומטען.", "כלי עבודה", "good", "כוללת ביטים בסיסיים."),
  item(demoAdminEmail, "צידנית משפחתית", "צידנית קשיחה לטיולים וים.", "ציוד טיולים", "used", "מתאימה לבקבוקים וקרחונים."),
  item(demoAdminEmail, "ערכת קפה", "פקל קפה קטן עם גזיה, פינג'ן וכוסות.", "ציוד טיולים", "good", "לא כולל בלון גז."),
  item("noa@borrow.local", "מכסחת דשא", "מכסחת חשמלית לחצר קטנה או בינונית.", "כלי עבודה", "used", "יש להחזיר נקיה מדשא."),
  item("noa@borrow.local", "תבנית קוגלהוף", "תבנית אפייה איכותית לעוגות.", "כלי מטבח", "good", ""),
  item("noa@borrow.local", "שולחן מתקפל", "שולחן פלסטיק מתקפל לאירוח.", "ציוד לאירועים", "good", "מתאים ל-6 אנשים."),
  item("noa@borrow.local", "כיסאות מתקפלים", "סט של ארבעה כיסאות מתקפלים.", "ציוד לאירועים", "used", "אפשר לקחת גם חלק מהסט."),
  item("noa@borrow.local", "משאבת אוויר", "משאבה לניפוח מזרנים וכדורים.", "ציוד ספורט", "good", ""),
  item("yoav@borrow.local", "מפוח עלים", "מפוח חשמלי לניקוי חצר ושביל.", "כלי עבודה", "used", "עם כבל מאריך קצר."),
  item("yoav@borrow.local", "חרמש חשמלי", "חרמש קל לקצוות דשא.", "כלי עבודה", "needs-care", "עובד, אבל החוט נגמר יחסית מהר."),
  item("yoav@borrow.local", "סולם 3 שלבים", "סולם ביתי קל ונוח.", "כלי עבודה", "good", ""),
  item("yoav@borrow.local", "ערכת מברגים", "סט מברגים בגדלים שונים.", "כלי עבודה", "good", ""),
  item("yoav@borrow.local", "ארגז כלים", "ארגז כלים בסיסי לעבודות קטנות.", "כלי עבודה", "used", ""),
  item("yoav@borrow.local", "רשת כדורעף", "רשת מתקפלת למשחק בחצר או בפארק.", "ציוד ספורט", "good", ""),
  item("michal@borrow.local", "סיר גדול", "סיר ענק לבישול לקבוצה.", "כלי מטבח", "good", "מעולה למרקים ותבשילים."),
  item("michal@borrow.local", "מכונת פסטה", "מכונה ידנית להכנת פסטה ביתית.", "כלי מטבח", "used", ""),
  item("michal@borrow.local", "מיקסר ידני", "מיקסר להכנת עוגות ובצקים קלים.", "כלי מטבח", "good", "לא מתאים לבצק כבד."),
  item("michal@borrow.local", "מגש אירוח", "מגש עץ גדול להגשה.", "ציוד לאירועים", "good", ""),
  item("michal@borrow.local", "סט צלחות לאירוח", "סט של 12 צלחות לבנות.", "ציוד לאירועים", "good", "נא להחזיר שטוף."),
  item("itai@borrow.local", "אוהל משפחתי", "אוהל גדול ונוח לטיולי סוף שבוע.", "ציוד טיולים", "good", "נא להחזיר יבש ונקי."),
  item("itai@borrow.local", "שק שינה", "שק שינה קל לעונת מעבר.", "ציוד טיולים", "used", ""),
  item("itai@borrow.local", "פנס ראש", "פנס ראש נטען לטיולים.", "ציוד טיולים", "good", "כולל כבל טעינה."),
  item("itai@borrow.local", "מנשא תינוק לטיולים", "מנשא גב לטיולים קצרים.", "ציוד טיולים", "used", ""),
  item("roni@borrow.local", "גיטרה קלאסית", "גיטרה קלאסית למתחילים.", "כלי נגינה", "used", "מגיעה עם נרתיק."),
  item("roni@borrow.local", "קלידים קטנים", "קלידים קומפקטיים לילדים ולמתחילים.", "כלי נגינה", "good", ""),
  item("roni@borrow.local", "מעמד תווים", "מעמד מתקפל לתווים.", "כלי נגינה", "good", ""),
  item("roni@borrow.local", "רמקול בלוטות'", "רמקול נייד לאירועים קטנים.", "ציוד לאירועים", "good", "נא לא להשתמש בגשם."),
  item("roni@borrow.local", "מיקרופון חוטי", "מיקרופון פשוט לערבי קריוקי.", "ציוד לאירועים", "used", ""),
  item("roni@borrow.local", "כבל מאריך 20 מטר", "כבל מאריך לשימוש ביתי ואירועים.", "כלי עבודה", "good", ""),
  item("daniel@borrow.local", "מחבטי טניס", "זוג מחבטים במצב טוב.", "ציוד ספורט", "good", "מתאים למשחק חובבני."),
  item("daniel@borrow.local", "כדורגל", "כדורגל בגודל 5.", "ציוד ספורט", "used", ""),
  item("daniel@borrow.local", "משקולות יד", "זוג משקולות של 5 קילו.", "ציוד ספורט", "good", ""),
  item("daniel@borrow.local", "מזרן יוגה", "מזרן יוגה עבה ונוח.", "ציוד ספורט", "good", "נא לנקות אחרי שימוש."),
  item("daniel@borrow.local", "קסדת אופניים", "קסדה למבוגר במידה בינונית.", "ציוד ספורט", "good", ""),
  item("tamar@borrow.local", "מקרן נייד", "מקרן קטן לערבי סרטים ומצגות.", "ציוד לאירועים", "good", "כולל כבל HDMI."),
  item("tamar@borrow.local", "מסך הקרנה", "מסך הקרנה מתקפל.", "ציוד לאירועים", "used", ""),
  item("tamar@borrow.local", "שרשרת תאורה", "גרילנדת תאורה לאירועי ערב.", "ציוד לאירועים", "good", ""),
  item("tamar@borrow.local", "מפת שולחן חגיגית", "מפה גדולה לאירוח.", "ציוד לאירועים", "good", ""),
  item("tamar@borrow.local", "קנקן שתייה גדול", "קנקן זכוכית עם ברז.", "כלי מטבח", "good", ""),
  item("omer@borrow.local", "גריל פחמים קטן", "גריל נייד לפיקניקים.", "ציוד טיולים", "used", "להחזיר נקי ככל האפשר."),
  item("omer@borrow.local", "צילייה", "צילייה קלה לים ופארק.", "ציוד טיולים", "good", ""),
  item("omer@borrow.local", "גזיבו מתקפל", "גזיבו 3x3 לאירועים בחצר.", "ציוד לאירועים", "used", "דורש שני אנשים להרכבה."),
  item("omer@borrow.local", "ערכת בדמינטון", "שני מחבטים ורשת קטנה.", "ציוד ספורט", "good", ""),
  item("omer@borrow.local", "סט קופסאות אחסון", "קופסאות גדולות להעברת ציוד.", "אחר", "good", ""),
  item("shira@borrow.local", "מכונת בועות", "מכונת בועות לאירועי ילדים.", "ציוד לאירועים", "good", "לא כולל נוזל בועות."),
  item("shira@borrow.local", "תחפושת פיראט", "תחפושת לילדים לגילאי 5-7.", "אחר", "good", ""),
  item("shira@borrow.local", "מכונת תפירה", "מכונת תפירה ביתית פשוטה.", "אחר", "used", "מתאימה לתיקונים קלים."),
  item("shira@borrow.local", "ערכת יצירה לילדים", "קופסה עם חומרים לפעילות יצירה.", "אחר", "good", "חלק מהחומרים מתכלים."),
  item("shira@borrow.local", "מצלמת אקסטרים", "מצלמת אקשן קטנה לטיולים.", "אחר", "used", "כולל כרטיס זיכרון קטן.")
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

function item(ownerEmail, title, description, category, condition, notes) {
  return {
    ownerEmail,
    title,
    description,
    notes,
    condition,
    category,
    images: []
  };
}
