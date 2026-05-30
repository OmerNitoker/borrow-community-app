import bcrypt from "bcryptjs";
import { Community } from "../models/Community.js";
import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";
import { User } from "../models/User.js";

const demoPassword = "demo123456";
const demoUserEmail = "demo@borrow.local";
const demoJoinCode = "DEMO2026";

const demoItems = [
  {
    title: "אוהל משפחתי",
    description: "אוהל גדול ונוח לטיולי סוף שבוע.",
    notes: "נא להחזיר יבש ונקי.",
    condition: "good",
    category: "ציוד טיולים",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
        publicId: "demo/tent"
      }
    ]
  },
  {
    title: "מקדחה",
    description: "מקדחה ביתית לעבודות קלות.",
    notes: "כולל סט מקדחים בסיסי.",
    condition: "used",
    category: "כלי עבודה",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
        publicId: "demo/drill"
      }
    ]
  },
  {
    title: "מיקסר ידני",
    description: "מיקסר להכנת עוגות ובצקים קלים.",
    notes: "לא מתאים לבצק כבד.",
    condition: "good",
    category: "כלי מטבח",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        publicId: "demo/mixer"
      }
    ]
  },
  {
    title: "גיטרה קלאסית",
    description: "גיטרה קלאסית למתחילים.",
    notes: "מגיעה עם נרתיק.",
    condition: "used",
    category: "כלי נגינה",
    images: [
      {
        url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
        publicId: "demo/guitar"
      }
    ]
  },
  {
    title: "מחבטי טניס",
    description: "זוג מחבטים במצב טוב.",
    notes: "מתאים למשחק חובבני.",
    condition: "good",
    category: "ציוד ספורט",
    images: [
      {
        url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
        publicId: "demo/tennis"
      }
    ]
  }
];

export async function seedDemoData({ reset = false } = {}) {
  if (reset) {
    const demoUsers = await User.find({ isDemoUser: true }).select("_id");
    const demoCommunities = await Community.find({ isDemoCommunity: true }).select("_id");
    const demoUserIds = demoUsers.map((user) => user._id);
    const demoCommunityIds = demoCommunities.map((community) => community._id);

    await Item.deleteMany({ isDemoItem: true });
    await Membership.deleteMany({
      $or: [{ user: { $in: demoUserIds } }, { community: { $in: demoCommunityIds } }]
    });
    await Community.deleteMany({ isDemoCommunity: true });
    await User.deleteMany({ isDemoUser: true });
  }

  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const user = await User.findOneAndUpdate(
    { email: demoUserEmail },
    {
      name: "משתמש דמו",
      email: demoUserEmail,
      passwordHash,
      phone: "050-123-4567",
      isDemoUser: true
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const community = await Community.findOneAndUpdate(
    { joinCode: demoJoinCode },
    {
      name: "קהילת הדמו",
      description: "קהילה לדוגמה שמציגה קטלוג פריטים, חברות והרשאות קשר.",
      joinCode: demoJoinCode,
      requiredApproval: true,
      createdBy: user._id,
      isDemoCommunity: true,
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Membership.findOneAndUpdate(
    { user: user._id, community: community._id },
    {
      user: user._id,
      community: community._id,
      status: "approved",
      role: "admin"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const existingItemCount = await Item.countDocuments({
    community: community._id,
    isDemoItem: true
  });

  if (existingItemCount === 0) {
    await Item.insertMany(
      demoItems.map((item) => ({
        ...item,
        community: community._id,
        owner: user._id,
        isActive: true,
        isDemoItem: true
      }))
    );
  }

  return { user, community };
}
