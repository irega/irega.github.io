import { ProfilePicture } from "./ProfilePicture/ProfilePicture";
import { ProfileInfo } from "./ProfileInfo/ProfileInfo";

import "./Profile.css";

const Profile = () => {
  return (
    <div className="horizontal-padding vertical-padding">
      <section className="profile">
        <ProfileInfo />
        <ProfilePicture />
      </section>
    </div>
  );
};

export { Profile };
