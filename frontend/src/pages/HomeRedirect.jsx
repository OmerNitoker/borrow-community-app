import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyCommunities } from "../api/communityApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";

function HomeRedirect() {
  const [target, setTarget] = useState("");

  useEffect(() => {
    getMyCommunities().then((data) => {
      const memberships = data.memberships || [];
      const approvedMemberships = memberships.filter((membership) => membership.status === "approved");
      const lastCommunityId = localStorage.getItem("borrow:lastCommunityId");
      const approved =
        approvedMemberships.find((membership) => membership.community.id === lastCommunityId) || approvedMemberships[0];
      const pending = memberships.find((membership) => membership.status === "pending");

      if (approved) {
        setTarget(`/communities/${approved.community.id}`);
      } else if (pending) {
        setTarget(`/pending/${pending.community.id}`);
      } else {
        setTarget("/onboarding");
      }
    });
  }, []);

  if (!target) {
    return <LoadingScreen />;
  }

  return <Navigate replace to={target} />;
}

export default HomeRedirect;
