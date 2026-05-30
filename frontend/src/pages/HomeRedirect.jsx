import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyCommunities } from "../api/communityApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";

function HomeRedirect() {
  const [target, setTarget] = useState("");

  useEffect(() => {
    getMyCommunities().then((data) => {
      const memberships = data.memberships || [];
      const approved = memberships.find((membership) => membership.status === "approved");
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
