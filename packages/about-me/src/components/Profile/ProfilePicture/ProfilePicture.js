import image from "../../../assets/img/aboutme_profile.jpg";
import './ProfilePicture.css';

const ProfilePicture = () =>
  <span className="profile-img-section">
    <img className="profile-img" src={image} alt="talking at JSDay Canary Islands 2019" />
  </span>;

export { ProfilePicture };
