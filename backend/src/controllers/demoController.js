import { seedDemoData } from "../services/demoDataService.js";
import { createAuthToken } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authCookieName, getAuthCookieOptions } from "../utils/cookies.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const enterDemo = asyncHandler(async (req, res) => {
  const { user, community } = await seedDemoData();
  const token = createAuthToken(user);

  res.cookie(authCookieName, token, getAuthCookieOptions());
  res.json({
    user: sanitizeUser(user),
    community: {
      id: community._id.toString(),
      name: community.name,
      description: community.description,
      joinCode: community.joinCode,
      requiredApproval: community.requiredApproval,
      imageUrl: community.imageUrl,
      isDemoCommunity: community.isDemoCommunity
    }
  });
});
